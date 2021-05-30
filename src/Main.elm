module Main exposing (main)

import Browser
import Html
    exposing
        ( Html
        , text
        )



-- Init


main : Program Flags Model Msg
main =
    Browser.element
        { init = init
        , view = view
        , update = update
        , subscriptions = \_ -> Sub.none
        }


type alias Model =
    {}


type alias Flags =
    {}


type alias Msg =
    Never


init : Flags -> ( Model, Cmd Msg )
init _ =
    ( {}, Cmd.none )



-- Update


update : Msg -> Model -> ( Model, Cmd Msg )
update _ model =
    ( model, Cmd.none )



-- View


view : Model -> Html Msg
view _ =
    text "hello"
