import { connectRoutes, NOT_FOUND, redirect } from 'redux-first-router';
import createHistory from 'history/createBrowserHistory';
import queryString from 'qs';

import NationalSections from './sections/national-circumstances';
import GHGSections from './sections/ghg-emissions';

const history = createHistory();

export const HOME = 'location/HOME';
export const NATIONAL_CIRCUMSTANCES = 'location/NATIONAL_CIRCUMSTANCES';
export const GHG_EMISSIONS = 'location/GHG_EMISSIONS';

export const routes = {
  [HOME]: {
    nav: false,
    label: 'Overview',
    path: '/',
    component: 'pages/home/home'
  },
  [NATIONAL_CIRCUMSTANCES]: {
    nav: true,
    label: 'National Circumstances',
    link: '/national-circumstances',
    path: '/national-circumstances/:section?',
    component: 'layouts/sections/sections',
    sections: NationalSections
  },
  [GHG_EMISSIONS]: {
    nav: true,
    label: 'GHG Emissions',
    link: '/ghg-emissions',
    path: '/ghg-emissions/:section?',
    component: 'layouts/sections/sections',
    sections: GHGSections
  },
  [NOT_FOUND]: {
    path: '/404',
    thunk: dispatch => dispatch(redirect({ type: HOME }))
  }
};

export default connectRoutes(history, routes, { querySerializer: queryString });
