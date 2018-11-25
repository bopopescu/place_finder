const config = {
	apiKey: "AIzaSyCEqUA8ZnQfxqkUY0pHzOEJL0agYdrHFdE",
	authDomain: "picture-finder-social-site.firebaseapp.com",
	databaseURL: "https://picture-finder-social-site.firebaseio.com",
	projectId: "picture-finder-social-site",
	storageBucket: "picture-finder-social-site.appspot.com",
	messagingSenderId: "246129335210"
};
const firebase = require('firebase').initializeApp(config);
const db = firebase.firestore();
db.settings({
	timestampsInSnapshots: true
});

import Vue from 'vue';
import Vuex from 'vuex';
import createPersistedState from 'vuex-persistedstate';
import moment from 'moment';

Vue.use(Vuex);

export default new Vuex.Store({
	plugins: [createPersistedState()],
	state: {
		user: null,
		loginError: '',
		registerError: '',
		userContent: [],
		allContent: [],
		searchResults: [],
		isLoading: false,
		showModal: false,
		uploadMessage: {},
		modalObject: {},
		expandedItemObject: {},
		showExpandedView: false,
	},
	getters: {
		user: state => state.user,
		loggedIn: state => {
			if (state.user === null)
				return false;
			return true;
		},
		loginError: state => state.loginError,
		registerError: state => state.registerError,
		userContent: state => state.userContent,
		allContent: state => state.allContent,
		searchResults: state => state.searchResults,
		isLoading: state => state.isLoading,
		showModal: state => state.showModal,
		uploadMessage: state => state.uploadMessage,
		modalObject: state => state.modalObject,
		expandedItemObject: state => state.expandedItemObject,
		showExpandedView: state => state.showExpandedView,
	},
	mutations: {
		setUser(state, user) {
			state.user = user;
		},
		setLoginError(state, message) {
			state.loginError = message;
		},
		setRegisterError(state, message) {
			state.registerError = message;
		},
		setUserContent(state, content) {
			state.userContent = content;
		},
		setAllContent(state, content) {
			state.allContent = content;
		},
		setSearchResults(state, results) {
			state.searchResults = results;
		},
		setIsLoading(state, loading) {
			state.isLoading = loading;
		},
		setShowModal(state, show) {
			state.showModal = show;
		},
		setUploadMessage(state, message) {
			state.uploadMessage = message;
		},
		setModalObject(state, object) {
			state.modalObject = object;
		},
		setExpandedItemObject(state, object) {
			state.expandedItemObject = object;
		},
		setShowExpandedView(state, show) {
			state.showExpandedView = show;
		}
	},
	actions: {
		// Initialize //
		initialize(context) {
			context.commit('setRegisterError', '');
			context.commit('setLoginError', '');
			context.commit('setIsLoading', false);
			context.commit('setShowModal', false);
			context.commit('setUploadMessage', {});
			context.commit('setShowExpandedView', false);
			let token = localStorage.getItem('token');
			firebase.auth().onAuthStateChanged((user) => {
				if (user) {
					context.commit('setUser', user);
					console.log(user);
				} else {
					context.commit('setUser', null);
				}
			});
		},

		// Registration, Login //
		signup(context, user) {
			context.commit('setIsLoading', true);
			firebase.auth().createUserWithEmailAndPassword(user.email, user.password)
				.then(response => {
					context.commit('setRegisterError', '');
					context.commit('setLoginError', '');

					var u = firebase.auth().currentUser;
					u.updateProfile({ displayName: user.username }).then(() => {
						context.commit('setUser', u);
						context.commit('setShowModal', false);
					}).catch((error) => {
						console.log('Update User Error', error);
					});
				}).catch(error => {
					console.log(error);
					context.commit('setRegisterError', error.message);
					context.commit('setUser', null);
				});

			context.commit('setIsLoading', false);
		},

		login(context, user) {
			context.commit('setIsLoading', true);
			firebase.auth().signInWithEmailAndPassword(user.email, user.password)
				.then(response => {
					context.commit('setRegisterError', '');
					context.commit('setLoginError', '');

					console.log(response['user']['uid']);
					context.commit('setShowModal', false);
				})
				.catch(error => {
					console.log(error);
					context.commit('setLoginError', error.message);
					context.commit('setUser', null);
				});

			context.commit('setIsLoading', false);
		},

		logout(context) {
			firebase.auth().signOut()
				.then(() => {
					console.log('Signed Out');
					context.commit('setUser', null);
				}).catch(error => {
					console.error('Sign Out Error', error);
				});
		},

		addUpload(context, upload) {
			context.commit('setIsLoading', true);

			firebase.auth().onAuthStateChanged((user) => {
				if (user) {
					var storage = firebase.storage().ref();
					var task = storage.child('images/' + upload.imageName).put(upload.image);
					task.on('state_changed', function (snapshot) {
						var progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
					}, function (error) {

					}, function () {
						task.snapshot.ref.getDownloadURL().then((downloadUrl) => {
							db.collection('uploads').add({
								description: upload.description,
								image: downloadUrl,
								imageName: upload.imageName,
								tags: upload.tags,
								address: upload.address,
								location: upload.location,
								username: user.displayName,
								created: moment().format("MMM Do YYYY")
							}).then(function (docRef) {
								context.commit('setIsLoading', false);
								context.commit('setShowModal', false);
							}).catch(function (error) {
								context.commit('setIsLoading', false);
								console.log("Error uploading: ", error);
								context.commit('setUploadMessage', { message: 'Upload unsuccessful. Please try again.', messageColor: 'red' });
							});
						});
					});
				}
			});
		},

		getAllUploads(context) {
			db.collection("uploads").onSnapshot((querySnapshot) => {
				var content = [];
				querySnapshot.forEach((doc) => {
					content.push({ id: doc.id, data: doc.data() });
				});
				console.log(content);
				context.commit('setAllContent', content);
			});
		},

		getUserUploads(context) {
			firebase.auth().onAuthStateChanged((user) => {
				if (user) {
					db.collection("uploads").where("username", "==", user.displayName).onSnapshot((querySnapshot) => {
						var content = [];
						querySnapshot.forEach((doc) => {
							content.push({ id: doc.id, data: doc.data() });
						});
						context.commit('setUserContent', content);
					});
				}
			});
		},

		updateUpload(context, upload) {
			context.commit('setIsLoading', true);

			firebase.auth().onAuthStateChanged((user) => {
				if (user) {
					if (upload.image instanceof Blob) {
						var storage = firebase.storage().ref();
						var task = storage.child('images/' + upload.imageName).put(upload.image);
						task.on('state_changed', function (snapshot) {

						}, function (error) {

						}, function () {
							task.snapshot.ref.getDownloadURL().then((downloadUrl) => {
								db.collection('uploads').doc(upload.id).update({
									description: upload.description,
									image: downloadUrl,
									imageName: upload.imageName,
									tags: upload.tags,
									address: upload.address,
									location: upload.location
								}).then(function (docRef) {
									context.commit('setIsLoading', false);
									context.commit('setShowModal', false);
									storage.child('images/' + upload.oldImageName).delete().then(function () {
										console.log("old image deleted successfully");
									}).catch(function (error) {
										console.log("old image not deleted successfully: ", error);
									});
								}).catch(function (error) {
									context.commit('setIsLoading', false);
									console.log("Error uploading: ", error);
									context.commit('setUploadMessage', { message: 'Update unsuccessful. Please try again.', messageColor: 'red' });
								});
							});
						});
					} else {
						db.collection('uploads').doc(upload.id).update({
							description: upload.description,
							imageName: upload.imageName,
							tags: upload.tags,
							address: upload.address,
							location: upload.location
						}).then(function (docRef) {
							context.commit('setIsLoading', false);
							context.commit('setShowModal', false);
						}).catch(function (error) {
							context.commit('setIsLoading', false);
							console.log("Error uploading: ", error);
							context.commit('setUploadMessage', { message: 'Update unsuccessful. Please try again.', messageColor: 'red' });
						});
					}
				}
			});
		},

		deleteUpload(context, item) {
			firebase.auth().onAuthStateChanged((user) => {
				if (user) {
					db.collection('uploads').doc(item.id).delete().then(function () {
						console.log("delete successful");
						firebase.storage().ref().child('images/' + item.data.imageName).delete().then(function () {
							console.log("image deleted successfully");
						}).catch(function (error) {
							console.log("image not deleted successfully: ", error);
						});
					}).catch(function (error) {
						console.log("delete unsuccessful");
					});
				}
			});
		},

		doSearch(context, keywords) {
			var strings = keywords.split(/,?\s+/);
			var results = [];
			for (var i = 0; i < strings.length; i++) {
				db.collection("uploads").where("tags", "array-contains", strings[i]).get().then((querySnapshot) => {
					querySnapshot.forEach((doc) => {
						results.push({ id: doc.id, data: doc.data() });
					});
				});
			}
			context.commit('setSearchResults', results);
		},

		doUserSearch(context, username) {
			var results = [];
			db.collection('uploads').where('username', '==', username).get().then((querySnapshot) => {
				querySnapshot.forEach((doc) => {
					results.push({ id: doc.id, data: doc.data() });
				});
			});
			context.commit('setSearchResults', results);
		},

		modal(context, show) {
			context.commit('setShowModal', show.show);
			if (show.show) {
				context.commit('setIsLoading', false);
				context.commit('setRegisterError', '');
				context.commit('setLoginError', '');
				context.commit('setUploadMessage', {});
			}
		},

		modalObject(context, object) {
			context.commit('setModalObject', object);
			context.commit('setShowModal', true);
		},

		expandItemObject(context, object) {
			console.log(object);
			if (object.id === '') {
				context.commit('setShowExpandedView', false);
			} else {
				context.commit('setShowExpandedView', true);
			}
			context.commit('setExpandedItemObject', object);
		},
	}
});