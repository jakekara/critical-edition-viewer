import React, { useEffect, useState } from 'react';
import {
  BrowserRouter as Router,
  Switch,
  Route,
  useParams,
  useLocation,
} from 'react-router-dom';
import Viewer from './components/Viewer';
// import DebugLogger from "./utils/DebugLogger";
import './App.css';
// import EssayIndexItem from "./components/EssayIndexItem";
import IndexPage from './components/IndexPage';
import { EssayDataEntry } from './Data/EssayData';
import {
  DataContext,
  DataContextObject,
  defaultDataContext,
} from './Data/Context';
import { fetchProjectConfiguration } from './Data/api';

export function ScrollToTop() {
  const { pathname } = useLocation();

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);

  return null;
}
// import LogoBar from "./components/Viewer/LogoBar";
// const logger = new DebugLogger("App: ");
function ViewerWrapper() {
  const context = React.useContext(DataContext);

  function ViewError(props: { message: string }) {
    const { message } = props;
    return <div>{message}</div>;
  }

  function BadViewRequest() {
    return <ViewError message="Error Loading Essay" />;
  }

  function EssayNotFound() {
    return <ViewError message="" />;
  }

  const params: { essayID: string } = useParams();

  if (!params.essayID) {
    return <BadViewRequest />;
  }

  if (!context) return <ViewError message="Context Not Loaded" />;
  const { essays } = context;

  // look for essay. when multiple have the same id, return the first
  const matches = essays.filter((e) => e.id === params.essayID);
  let essay: EssayDataEntry;
  if (matches.length >= 1) {
    [essay] = matches;
  } else {
    return <EssayNotFound />;
  }

  return <Viewer essay={essay} />;
}

// function Loading() {
//   return <div>Loading</div>;
// }

export function RenderApp() {
  return (
    <div className="App serif-copy-ff">
      <Router>
        <ScrollToTop />
        <Switch>
          <Route path="/example-essay" />
          <Route path="/essay/:essayID">
            <ViewerWrapper />
          </Route>
          <Route path="/">
            <IndexPage />
          </Route>
        </Switch>
      </Router>
    </div>
  );
}

export default function App() {
  const [data, setData] = useState<DataContextObject>(defaultDataContext());

  useEffect(() => {
    fetchProjectConfiguration().then((config) => {
      setData(config);
    });
  }, []);

  if (!data) {
    return <div>Project data not loaded</div>;
  }

  return (
    <DataContext.Provider value={data}>
      <RenderApp />
    </DataContext.Provider>
  );
}
