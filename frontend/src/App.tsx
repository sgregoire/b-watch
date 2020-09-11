import React from 'react';
import './App.css';
import {DevTools, Program, withReduxDevTools} from "react-tea-cup";
import {Model, init, view, update, subscriptions, Msg, Flags } from "bwatch-common-front";
import {Api} from "bwatch-common";
import {RemoteApi} from "bwatch-common";
import {connectToWs} from "bwatch-common-front/dist/bwatch/BWatch";

const api: Api = new RemoteApi("/api");

const flags: Flags = {
  tag: "browser"
};

connectToWs();

export const App = () => {
  return (
    <Program
      init={() => init(flags, api)}
      view={(dispatch, model) => view(flags, dispatch, model)}
      update={(msg, model) => update(flags, api, msg, model)}
      subscriptions={() => subscriptions(flags)}
      devTools={withReduxDevTools(DevTools.init<Model, Msg>(window))}
    />
  );
}

export default App;
