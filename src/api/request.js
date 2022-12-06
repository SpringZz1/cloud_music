import axios from 'axios';
import { axiosInstance, categoryMap } from './config';
export const getBannerRequest = () => {
  return axiosInstance.get('/banner');
};

export const getRecommendListRequest = () => {
  return axiosInstance.get('/personalized');
};

export const getHotSingerListRequest = (count) => {
  return axiosInstance.get(`/top/artists?offset=${count}`);
};

// export const getSingerRequest = (category, alpha, count) => {
//   return axiosInstance.get(
//     `/artists/list?cat=${category}&initial=${alpha.toLowerCase()}&offset=${count}`
//   );
// };
export const getSingerRequest = (category, alpha, count) => {
  const { type, area } = !!category ? categoryMap.get(category) : {};
  return axiosInstance.get(
    `/artist/list?${
      type && area ? `type=${type}&area=${area}` : ''
    }&initial=${alpha.toLowerCase()}&offset=${count}`
  );
};

export const getRankListRequest = () => {
  return axiosInstance.get('/toplist/detail');
};

export const getAlbumDetailRequest = (id) => {
  return axiosInstance.get(`/playlist/detail?id=${id}`);
};

export const getSingerInfoRequest = (id) => {
  return axiosInstance.get(`/artists?id=${id}`);
};

export const getLyricRequest = (id) => {
  return axiosInstance.get(`/lyric?id=${id}`);
};

export const getHotKeyWordsRequest = () => {
  return axiosInstance.get(`/search/hot`);
};

export const getSuggestListRequest = (query) => {
  return axiosInstance.get(`/search/suggest?keywords=${query}`);
};

export const getResultSongsListRequest = (query) => {
  return axiosInstance.get(`/search?keywords=${query}`);
};

// 拿到id重新获取具体的单曲数据
export const getSongDetailRequest = (id) => {
  return axiosInstance.get(`/song/detail?ids=${id}`);
};
