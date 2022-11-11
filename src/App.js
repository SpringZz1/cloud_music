import { GlobalStyle } from './style';
import { IconStyle } from './assets/iconfont/iconfont';
import router from './routes';
import { HashRouter, Route, RouterProvider } from 'react-router-dom';

function App() {
  return (
    <>
      <GlobalStyle></GlobalStyle>
      <IconStyle></IconStyle>
      <RouterProvider router={router}></RouterProvider>
      {/* <div className="App">
        <i className="iconfont">&#xe62b;</i>
      </div> */}
    </>
  );
}

export default App;
