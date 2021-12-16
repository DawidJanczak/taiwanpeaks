port module Main exposing (main)

import Browser
import Browser.Dom as Dom
import Html
    exposing
        ( Html
        , div
        , i
        , span
        , table
        , tbody
        , td
        , text
        , th
        , thead
        , tr
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


type alias SortKind =
    ( SortColumn, SortOrder )


type SortOrder
    = Asc
    | Desc


type SortColumn
    = Rank
    | Elevation


type alias Model =
    { flags : Flags
    , peakListing : PeakListing
    , selectedPeak : Maybe String
    , currentSort : SortKind
    }


type alias Flags =
    SelectList PeakListing


type alias Peak =
    { lat : Float
    , lon : Float
    , name : String
    , rank : Int
    , elevation : Int
    }


type alias PeakListing =
    { heading : String
    , peaks : List Peak
    }


type Msg
    = PeakSelected Peak
    | PeakSelectedOnMap String
    | SwitchHeading Flags
    | SortBy SortKind
    | Noop (Result Dom.Error ())


init : Dec.Value -> ( Model, Cmd Msg )
init encodedFlags =
    case Dec.decodeValue flagsDecoder encodedFlags of
        Ok flags ->
            ( { flags = flags
              , selectedPeak = Nothing
              , peakListing = SelectList.selected flags
              , currentSort = ( Rank, Asc )
              }
            , Cmd.none
            )

        Err _ ->
            -- TODO fix
            ( { flags = SelectList.fromLists [] (PeakListing "" []) []
              , selectedPeak = Nothing
              , peakListing = PeakListing "" []
              , currentSort = ( Rank, Asc )
              }
            , Cmd.none
            )



-- Decoders


peakDecoder : Dec.Decoder Peak
peakDecoder =
    Dec.succeed Peak
        |> Pipe.required "latitude" Dec.float
        |> Pipe.required "longitude" Dec.float
        |> Pipe.required "name" Dec.string
        |> Pipe.required "rank" Dec.int
        |> Pipe.required "ele" Dec.int


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

        SortBy sortKind ->
            ( { model
                | peakListing = sortBy sortKind model.peakListing
                , currentSort = sortKind
              }
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


sortBy : SortKind -> PeakListing -> PeakListing
sortBy sortKind peakListing =
    { peakListing | peaks = updateSortOnListing sortKind peakListing.peaks }


updateSortOnListing : SortKind -> List Peak -> List Peak
updateSortOnListing ( sortColumn, sortOrder ) peaks =
    let
        sorted =
            List.sortWith (generateSortOrder sortColumn) peaks
    in
    case sortOrder of
        Asc ->
            sorted

        Desc ->
            List.reverse sorted


generateSortOrder : SortColumn -> Peak -> Peak -> Order
generateSortOrder sortColumn peakA peakB =
    case sortColumn of
        Rank ->
            compare peakA.rank peakB.rank

        Elevation ->
            compare peakA.elevation peakB.elevation


getSortOrder : SortColumn -> Model -> SortKind
getSortOrder sortColumn { currentSort } =
    let
        ( currentColumn, currentOrder ) =
            currentSort
    in
    if sortColumn == currentColumn then
        case currentOrder of
            Asc ->
                ( sortColumn, Desc )

            Desc ->
                ( sortColumn, Asc )

    else
        ( sortColumn, Asc )



-- View


view : Model -> Html Msg
view model =
    div [ class "w-9/10 h-full py-5 flex flex-col" ]
        [ div [ class "flex text-center text-xl cursor-pointer" ] <|
            SelectList.selectedMap renderPeakHeading model.flags
        , div [ class "min-h-0 overflow-y-auto" ]
            [ table
                [ class "border-collapse cursor-default w-full relative table-fixed"
                , id "listing"
                ]
                [ thead []
                    [ tr [ class "text-left sticky top-0" ]
                        [ th
                            [ class "bg-blue-100"
                            , getSortOrder Rank model |> SortBy |> onClick
                            ]
                            [ span [ class "flex" ]
                                [ span [] [ text "Rank" ]
                                , renderActiveSort Rank model.currentSort
                                ]
                            ]
                        , th [ class "bg-blue-100" ] [ text "Chinese Name" ]
                        , th
                            [ class "bg-blue-100 flex"
                            , getSortOrder Elevation model |> SortBy |> onClick
                            ]
                            [ span [ class "flex" ]
                                [ span [] [ text "Elevation" ]
                                , renderActiveSort Elevation model.currentSort
                                ]
                            ]
                        ]
                    ]
                , tbody [ class "text-sm" ] <|
                    List.map (renderPeak model.selectedPeak) model.peakListing.peaks
                ]
            ]
        ]


renderActiveSort : SortColumn -> SortKind -> Html Msg
renderActiveSort column ( currentSortCol, currentSortOrder ) =
    if column == currentSortCol then
        case currentSortOrder of
            Asc ->
                i [ class "ml-1 gg-arrow-up-r bg-blue-200" ] []

            Desc ->
                i [ class "ml-1 gg-arrow-down-r bg-blue-200" ] []

    else
        i [ class "ml-1 gg-arrows-v" ] []


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
        [ ( "p-2 rounded-t-lg flex-1", True )
        , ( "bg-gray-200", position /= SelectList.Selected )
        , ( "bg-blue-300", position == SelectList.Selected )
        ]


renderPeak : Maybe String -> Peak -> Html Msg
renderPeak maybeMapPopupHover peak =
    let
        popup =
            mapPopupOnPeak maybeMapPopupHover peak
    in
    tr
        [ classList
            [ ( "hover:bg-gray-100", not popup )
            , ( "bg-blue-300", popup )
            ]
        , id peak.name
        , PeakSelected peak |> onClick
        ]
        [ td [ class "p-1" ] [ String.fromInt peak.rank |> text ]
        , td [] [ text peak.name ]
        , td [] [ String.fromInt peak.elevation |> text ]
        ]


mapPopupOnPeak : Maybe String -> Peak -> Bool
mapPopupOnPeak maybeMapPopupHover peak =
    case maybeMapPopupHover of
        Just peakName ->
            peakName == peak.name

        Nothing ->
            False
