/** @type {import('tailwindcss').Config} */
export default {
	content: [
	  "./index.html",
	  "./src/**/*.{js,ts,jsx,tsx}",
	],
	theme: {
	  extend: {
		colors: {
		  'sw-red': '#E32434',
		  'sw-yellow': '#F6B207',
		  'sw-blue': '#164B64',
		  'sw-green': '#299D91',
		  'sw-red-light': '#F7BDC2',
		  'sw-yellow-light': '#FFFFB7',
		  'sw-blue-light': '#6CD0FF',
		  'sw-green-light': '#97E9E1',
		  'sw-red-dark': '#8E0A0A',
		  'sw-yellow-dark': '#A77B00',
		  'sw-blue-dark': '#001830',
		  'sw-green-dark': '#005D53',
		  'sw-grey': '#BFBEC5',
		  'sw-light-grey': '#F4F5F7',
		},
		fontFamily: {
		  'primary': ['Objektiv MK1', 'Montserrat', 'Arial', 'sans-serif'],
		  'fallback': ['Montserrat', 'sans-serif'],
		  'system': ['Arial', 'sans-serif'],
		},
		fontWeight: {
		  'regular': 400,
		  'bold': 700,
		  'xbold': 800,
		},
		fontSize: {
		  'body': '16px',
		  'label': '20px',
		  'head': '24px',
		  'subhead': '20px',
		  'hero': '95px',
		},
		lineHeight: {
		  'tight': '100%',
		  'normal': '110%',
		  'relaxed': '130%',
		},
		spacing: {
		  'small-margin': '5%',
		  'large-margin': '10%',
		},
		borderRadius: {
		  'button': '8px',
		},
		height: {
		  'button': '46px',
		},
	  },
	},
	plugins: [],
  }