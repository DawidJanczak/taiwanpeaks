port module Main exposing (main)

import Browser
import Browser.Dom as Dom
import Html
    exposing
        ( Html
        , div
        , li
        , ol
        , text
        )
import Html.Attributes
    exposing
        ( class
        , classList
        , id
        )
import Html.Events
    exposing
        ( onClick
        )
import Json.Decode as Dec
import Json.Decode.Pipeline as Pipe
import Json.Encode as Enc
import SelectList exposing (SelectList)



-- Ports


port peakSelected : Enc.Value -> Cmd msg


port peakSelectedOnMap : (String -> msg) -> Sub msg



-- Init


main : Program Dec.Value Model Msg
main =
    Browser.element
        { init = init
        , view = view
        , update = update
        , subscriptions = subscriptions
        }


subscriptions : Model -> Sub Msg
subscriptions _ =
    Sub.batch
        [ peakSelectedOnMap PeakSelectedOnMap
        ]


type alias Model =
    { flags : Flags
    , selectedPeak : Maybe String
    }


type alias Peak =
    { lat : Float
    , lon : Float
    , name : String
    }


type alias PeakListing =
    { heading : String
    , peaks : List Peak
    }


type alias Flags =
    SelectList PeakListing


type Msg
    = PeakSelected Peak
    | PeakSelectedOnMap String
    | SwitchHeading Flags
    | Noop (Result Dom.Error ())


init : Dec.Value -> ( Model, Cmd Msg )
init encodedFlags =
    case Dec.decodeValue flagsDecoder encodedFlags of
        Ok flags ->
            ( { flags = flags
              , selectedPeak = Nothing
              }
            , Cmd.none
            )

        Err _ ->
            -- TODO fix
            ( { flags = SelectList.fromLists [] (PeakListing "" []) [], selectedPeak = Nothing }
            , Cmd.none
            )



-- Decoders


peakDecoder : Dec.Decoder Peak
peakDecoder =
    Dec.succeed Peak
        |> Pipe.required "latitude" Dec.float
        |> Pipe.required "longitude" Dec.float
        |> Pipe.required "name" Dec.string


peakListingDecoder : Dec.Decoder PeakListing
peakListingDecoder =
    Dec.succeed PeakListing
        |> Pipe.required "heading" Dec.string
        |> Pipe.required "peaks" (Dec.list peakDecoder)


flagsDecoder : Dec.Decoder Flags
flagsDecoder =
    Dec.list peakListingDecoder |> Dec.andThen initSelectList


initSelectList : List PeakListing -> Dec.Decoder Flags
initSelectList listing =
    case listing of
        head :: _ ->
            SelectList.fromLists [] head [] |> Dec.succeed

        _ ->
            Dec.fail "Empty list provided"



-- Update


update : Msg -> Model -> ( Model, Cmd Msg )
update msg model =
    case msg of
        PeakSelected peak ->
            ( { model | selectedPeak = Just peak.name }, encodePeak peak |> peakSelected )

        SwitchHeading list ->
            ( { model | flags = list }, Cmd.none )

        PeakSelectedOnMap peakName ->
            ( { model | selectedPeak = Just peakName }
            , Cmd.none
            )

        Noop _ ->
            ( model, Cmd.none )


encodePeak : Peak -> Enc.Value
encodePeak peak =
    Enc.object
        [ ( "longitude", Enc.float peak.lon )
        , ( "latitude", Enc.float peak.lat )
        , ( "name", Enc.string peak.name )
        ]



-- View


view : Model -> Html Msg
view model =
    div [ class "w-9/10 h-full pb-10 pt-5 flex flex-col" ]
        [ div [ class "flex text-center text-xl cursor-pointer" ] <|
            SelectList.selectedMap renderPeakHeading model.flags
        , div [ class "min-h-0" ]
            [ ol [ class "list-decimal list-inside text-sm cursor-default h-full overflow-y-auto", id "listing" ] <|
                List.map (renderPeak model.selectedPeak) (SelectList.selected model.flags |> .peaks)
            ]
        ]


renderPeakHeading : SelectList.Position -> SelectList PeakListing -> Html Msg
renderPeakHeading position list =
    div
        [ headingClasses position
        , SwitchHeading list |> onClick
        ]
        [ SelectList.selected list |> .heading |> text ]


headingClasses : SelectList.Position -> Html.Attribute Msg
headingClasses position =
    classList
        [ ( "p-2 mb-1 rounded-t-lg flex-1", True )
        , ( "bg-gray-200", position /= SelectList.Selected )
        , ( "bg-blue-300", position == SelectList.Selected )
        ]


renderPeak : Maybe String -> Peak -> Html Msg
renderPeak maybeMapPopupHover peak =
    let
        popup =
            mapPopupOnPeak maybeMapPopupHover peak
    in
    li
        [ classList
            [ ( "hover:bg-gray-100", not popup )
            , ( "bg-blue-300", popup )
            , ( "p-1", True )
            ]
        , id peak.name
        , PeakSelected peak |> onClick
        ]
        [ text peak.name ]


mapPopupOnPeak : Maybe String -> Peak -> Bool
mapPopupOnPeak maybeMapPopupHover peak =
    case maybeMapPopupHover of
        Just peakName ->
            peakName == peak.name

        Nothing ->
            False
