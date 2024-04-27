import { Suspense, lazy } from 'react';
import { Route, Routes } from 'react-router-dom';
import './App.css';

const Loadable =
  (Component: React.ComponentType) => (props: JSX.IntrinsicAttributes) => (
    <Suspense fallback={<div>Loading...</div>}>
      <Component {...props} />
    </Suspense>
  );

const NotFound = Loadable(lazy(() => import('./pages/layout/__not-found')));

const PagePathsWithComponents: Record<string, any> = import.meta.glob(
  './pages/**/*.tsx',
);

console.log({
  PagePathsWithComponents,
  paths: Object.keys(PagePathsWithComponents),
});

const routes = Object.keys(PagePathsWithComponents).map(path => {
  const excludedMatch = path.match(/\.\/pages\/layout\/__[^/\[]+\.tsx$/);
  // console.log({ excludedMatch });
  if (excludedMatch) {
    return null; // Exclude files starting with 2 underscores
  }

  const dynamicMatch = path.match(/\.\/pages\/(.*)\/\[(.*)\]\.tsx$/);
  // console.log({ dynamicMatch });
  if (dynamicMatch) {
    const [, routePath, paramName] = dynamicMatch;
    return {
      name: `${routePath}/${paramName}`,
      path: `${routePath}/:${paramName}`,
      component: Loadable(lazy(PagePathsWithComponents[path])),
    };
  }

  const regularMatch = path.match(/\.\/pages\/(.*)\.tsx$/);
  // console.log({ regularMatch });
  if (regularMatch) {
    const [, name] = regularMatch;
    const lowerName = name.toLowerCase();
    return {
      name,
      path: lowerName === 'home' ? '/' : `/${lowerName.toLowerCase()}`,
      component: Loadable(lazy(PagePathsWithComponents[path])),
    };
  }

  return null; // Ignore invalid paths
});

console.log({ routes });

const filteredRoutes = routes.filter(
  (
    route,
  ): route is {
    name: string;
    path: string;
    component: (props: JSX.IntrinsicAttributes) => JSX.Element;
  } => route !== null,
);

const App = () => {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <Routes>
        <Route path='/'>
          {filteredRoutes.map(({ path, component: ReactComponent }) => (
            <Route key={path} path={path} element={<ReactComponent />} />
          ))}
          <Route path='*' element={<NotFound />} />
        </Route>
      </Routes>
    </Suspense>
  );
};

export default App;
