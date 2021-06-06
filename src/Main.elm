port module Main exposing (main)

import Browser
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
        )
import Html.Events
    exposing
        ( onClick
        , onMouseOut
        , onMouseOver
        )
import Json.Decode as Dec
import Json.Decode.Pipeline as Pipe
import Json.Encode as Enc
import SelectList exposing (SelectList)



-- Ports


port hoverOver : Enc.Value -> Cmd msg


port hoverOut : () -> Cmd msg


port mapPopupHover : (String -> msg) -> Sub msg


port mapPopupHoverOut : (() -> msg) -> Sub msg



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
        [ mapPopupHover MapPopupHover
        , mapPopupHoverOut MapPopupHoverOut
        ]


type alias Model =
    { flags : Flags
    , mapPopupHover : Maybe String
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
    = HoverOver Peak
    | HoverOut
    | MapPopupHover String
    | MapPopupHoverOut ()
    | SwitchHeading Flags


init : Dec.Value -> ( Model, Cmd Msg )
init encodedFlags =
    case Dec.decodeValue flagsDecoder encodedFlags of
        Ok flags ->
            ( { flags = flags
              , mapPopupHover = Nothing
              }
            , Cmd.none
            )

        Err err ->
            Dec.errorToString err |> Debug.todo



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
    case SelectList.fromList listing of
        Just selectList ->
            Dec.succeed selectList

        Nothing ->
            Dec.fail "Empty list provided"



-- Update


update : Msg -> Model -> ( Model, Cmd Msg )
update msg model =
    case msg of
        HoverOver peak ->
            ( model, encodePeak peak |> hoverOver )

        HoverOut ->
            ( model, hoverOut () )

        MapPopupHover peakName ->
            ( { model | mapPopupHover = Just peakName }, Cmd.none )

        MapPopupHoverOut _ ->
            ( { model | mapPopupHover = Nothing }, Cmd.none )

        SwitchHeading list ->
            ( { model | flags = list }, Cmd.none )


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
    div [ class "w-9/10 m-5" ]
        [ div [ class "flex text-center text-xl cursor-pointer" ] <|
            SelectList.selectedMap renderPeakHeading model.flags
        , div [ class "h-full" ]
            [ ol [ class "list-decimal list-inside text-sm cursor-default h-full overflow-y-auto" ] <|
                List.map (renderPeak model.mapPopupHover) (SelectList.selected model.flags |> .peaks)
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
        [ ( "w-1/4 bg-gray-200 p-2 m-2 rounded-t-lg", True )
        , ( "bg-gray-200", position /= SelectList.Selected )
        , ( "bg-blue-200", position == SelectList.Selected )
        ]


renderPeak : Maybe String -> Peak -> Html Msg
renderPeak maybeMapPopupHover peak =
    li
        [ classList
            [ ( "hover:bg-blue-300", True )
            , ( "bg-blue-300", mapPopupOnPeak maybeMapPopupHover peak )
            ]
        , HoverOver peak |> onMouseOver
        , HoverOut |> onMouseOut
        ]
        [ text peak.name ]


mapPopupOnPeak : Maybe String -> Peak -> Bool
mapPopupOnPeak maybeMapPopupHover peak =
    case maybeMapPopupHover of
        Just peakName ->
            peakName == peak.name

        Nothing ->
            False
