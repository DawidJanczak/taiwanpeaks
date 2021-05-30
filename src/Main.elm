module Main exposing (main)

import Browser
import Html
    exposing
        ( Html
        , text
        )
import Json.Decode as Dec
import Json.Decode.Pipeline as Pipe



-- Init


main : Program Dec.Value Model Msg
main =
    Browser.element
        { init = init
        , view = view
        , update = update
        , subscriptions = \_ -> Sub.none
        }


type alias Model =
    { flags : Flags
    }


type alias Peak =
    { lat : Float
    , lon : Float
    , name : String
    }


type alias Flags =
    { top100 : List Peak
    }


type alias Msg =
    Never


init : Dec.Value -> ( Model, Cmd Msg )
init encodedFlags =
    case Dec.decodeValue flagsDecoder encodedFlags of
        Ok flags ->
            ( { flags = flags }, Cmd.none )

        Err err ->
            Dec.errorToString err |> Debug.todo



-- Decoders


peakDecoder : Dec.Decoder Peak
peakDecoder =
    Dec.succeed Peak
        |> Pipe.required "latitude" Dec.float
        |> Pipe.required "longitude" Dec.float
        |> Pipe.required "name" Dec.string


flagsDecoder : Dec.Decoder Flags
flagsDecoder =
    Dec.map Flags (Dec.list peakDecoder)



-- Update


update : Msg -> Model -> ( Model, Cmd Msg )
update _ model =
    ( model, Cmd.none )



-- View


view : Model -> Html Msg
view _ =
    text "hello"
