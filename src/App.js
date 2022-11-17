import { GlobalStyle } from './style';
import { IconStyle } from './assets/iconfont/iconfont';
import router from './routes';
import { RouterProvider } from 'react-router-dom';
import store from './store';
// import reducer from './store/reducer';
import { Provider } from 'react-redux';
import { Data } from './application/Singers/data';

function App() {
  return (
    <Provider store={store}>
      <GlobalStyle></GlobalStyle>
      <IconStyle></IconStyle>
      <Data>
        <RouterProvider router={router}></RouterProvider>
      </Data>
      {/* <div className="App">
        <i className="iconfont">&#xe62b;</i>
      </div> */}
    </Provider>
  );
}

export default App;
