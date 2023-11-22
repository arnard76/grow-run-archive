// Import the functions you need from the SDKs you need
import { initializeApp } from 'firebase/app';
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
	apiKey: 'AIzaSyDHtx9L1l0839dQgk2rmHwoso2Ud20GmsM',
	authDomain: 'grow-run-archive.firebaseapp.com',
	projectId: 'grow-run-archive',
	storageBucket: 'grow-run-archive.appspot.com',
	messagingSenderId: '1092699981645',
	appId: '1:1092699981645:web:c31f1619a1207f6eead904',

	databaseURL: ' https://grow-run-archive-default-rtdb.asia-southeast1.firebasedatabase.app'
};

// Initialize Firebase
export const app = initializeApp(firebaseConfig);
