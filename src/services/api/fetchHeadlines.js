import axios from 'axios';
//import { harcodedRes } from '../../public/dummydata/headlinesHardcodedrsponse';

const API_KEY = '525737202d594124b8101af59b1531b7';
const API_BASE_URL = 'https://newsapi.org/v2';
const TOP_HEADLINES_ENDPOINT = '/everything';
const COUNTRY = '?q=tesla';
const CATEGORY = '&from=2023-07-17&sortBy=publishedAt';

export const fetchHeadlines = async () => {
  try {
    const finalUrl = `${API_BASE_URL}${TOP_HEADLINES_ENDPOINT}${COUNTRY}${CATEGORY}&apiKey=${API_KEY}`;
    console.log('finalUrl', finalUrl);
    const response = await axios.get(finalUrl);
    return response?.data?.articles;
    //return harcodedRes;
  } catch (error) {
    console.error('Error fetching headlines:', error);
    throw error;
  }
};
