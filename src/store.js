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

import router from '@/router';

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
		filterResults: [],
		filters: [],
		isLoading: false,
		showModal: false,
		uploadMessage: {},
		modalObject: {},
		expandedItemObject: {},
		showExpandedView: false,
		mapUrl: '',
		launchMapUrl: '',
		distance: '',
		duration: '',
		reviewError: '',
		reviewState: false,
		currReviews: [],
		averageRating: 0.0,
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
		filterResults: state => state.filterResults,
		filters: state => state.filters,
		isLoading: state => state.isLoading,
		showModal: state => state.showModal,
		uploadMessage: state => state.uploadMessage,
		modalObject: state => state.modalObject,
		expandedItemObject: state => state.expandedItemObject,
		showExpandedView: state => state.showExpandedView,
		mapUrl: state => state.mapUrl,
		launchMapUrl: state => state.launchMapUrl,
		distance: state => state.distance,
		duration: state => state.duration,
		reviewError: state => state.reviewError,
		currReviews: state => state.currReviews,
		averageRating: state => state.averageRating,
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
		setFilterResults(state, results) {
			state.filterResults = results;
		},
		setFilters(state, filters) {
			state.filters = filters;
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
		},
		setMapUrl(state, url) {
			state.mapUrl = url;
		},
		setLaunchMapUrl(state, url) {
			state.launchMapUrl = url;
		},
		setDistance(state, distance) {
			state.distance = distance;
		},
		setDuration(state, duration) {
			state.duration = duration;
		},
		setReviewError(state, error) {
			state.reviewError = error;
		},
		setCurrReviews(state, reviews) {
			state.currReviews = reviews;
		},
		setAverageRating(state, rating) {
			state.averageRating = rating;
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
			context.commit('setSearchResults', []);
			context.commit('setFilters', []);
			firebase.auth().onAuthStateChanged((user) => {
				if (user) {
					context.commit('setUser', user);
					console.log(user);
					router.push({ path: '/content' });
				} else {
					context.commit('setUser', null);
				}
			});
		},

		// Registration, Login //
		signup(context, user) {
			if (user.email === "" || user.password === "") {
				context.commit('setRegisterError', 'Please enter valid information.');
				return;
			}
			context.commit('setIsLoading', true);

			return firebase.auth().createUserWithEmailAndPassword(user.email, user.password)
				.then(response => {
					context.commit('setRegisterError', '');
					context.commit('setLoginError', '');

					var u = firebase.auth().currentUser;
					return u.updateProfile({ displayName: user.username }).then(() => {
						context.commit('setUser', u);
						context.commit('setShowModal', false);
						context.commit('setIsLoading', false);
						return response;
					}).catch((error) => {
						console.log('Update User Error', error);
						context.commit('setIsLoading', false);
					});
				}).catch(error => {
					console.log(error);
					context.commit('setRegisterError', error.message);
					context.commit('setUser', null);
					context.commit('setIsLoading', false);
				});
		},

		login(context, user) {
			if (user.email === "" || user.password === "") {
				context.commit('setLoginError', 'Please enter valid information.');
				return;
			}
			context.commit('setIsLoading', true);
			return firebase.auth().signInWithEmailAndPassword(user.email, user.password)
				.then(response => {
					context.commit('setRegisterError', '');
					context.commit('setLoginError', '');

					context.commit('setShowModal', false);
					context.commit('setIsLoading', false);
					return response;
				})
				.catch(error => {
					console.log(error);
					context.commit('setLoginError', error.message);
					context.commit('setUser', null);
					context.commit('setIsLoading', false);
				});
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
					var images = [];
					var storage = firebase.storage().ref();
					for (var i = 0; i < upload.images.length; i++) {
						var imageName = upload.images[i].imageName;
						let task = storage.child('images/' + imageName).put(upload.images[i].image);
						task.on('state_changed', function (snapshot) {
							var progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
						}, function (error) {

						}, function () {
							task.snapshot.ref.getDownloadURL().then((downloadUrl) => {
								console.log(downloadUrl);
								images.push(downloadUrl);
								if (images.length == upload.images.length) {
									db.collection('uploads').add({
										description: upload.description,
										images: images,
										categories: upload.categories,
										tags: upload.tags,
										address: upload.address,
										location: upload.location,
										username: user.displayName,
										created: moment().format("MMM Do YYYY")
									}).then(function (docRef) {
										context.commit('setIsLoading', false);
										context.commit('setShowModal', false);
										context.dispatch('getAllUploads');
									}).catch(function (error) {
										context.commit('setIsLoading', false);
										console.log("Error uploading: ", error);
										context.commit('setUploadMessage', { message: 'Upload unsuccessful. Please try again.', messageColor: 'red' });
									});
								}
							});
						});
					}
				}
			});
		},

		getAllUploads(context) {
			db.collection("uploads").onSnapshot((querySnapshot) => {
				var content = [];
				querySnapshot.forEach((doc) => {
					content.push({ id: doc.id, data: doc.data() });
					if (context.getters.expandedItemObject !== {}) {
						if (doc.id === context.getters.expandedItemObject.id) {
							context.dispatch('expandItemObject', { id: doc.id, data: doc.data() });
						}
					}
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
					var images = [];
					var uploadImages = [];
					var allImages = [];
					upload.images.forEach(value => {
						allImages.push(value);
					});
					for (var i = 0; i < allImages.length; i++) {
						if (!(allImages[i].image instanceof Blob)) {
							images.push(allImages[i].image);
						} else {
							uploadImages.push(allImages[i]);
						}
					}

					if (images.length !== allImages.length) {
						for (var i = 0; i < uploadImages.length; i++) {
							var storage = firebase.storage().ref();
							var task = storage.child('images/' + uploadImages[i].imageName).put(uploadImages[i].image);
							task.on('state_changed', function (snapshot) {

							}, function (error) {

							}, function () {
								task.snapshot.ref.getDownloadURL().then((downloadUrl) => {
									images.push(downloadUrl);
									if (images.length === allImages.length) {
										db.collection('uploads').doc(upload.id).update({
											description: upload.description,
											images: images,
											categories: upload.categories,
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
								});
							});
						}
					} else {
						db.collection('uploads').doc(upload.id).update({
							images: images,
							categories: upload.categories,
							description: upload.description,
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

		addReview(context, info) {
			firebase.auth().onAuthStateChanged((user) => {
				if (user) {
					context.commit('setIsLoading', true);

					db.collection('uploads').doc(info.id).get().then(doc => {
						var reviews = doc.data().reviews;
						if (reviews === undefined) {
							reviews = [];
						}
						reviews.unshift({ user: user.displayName, review: info.review, rating: info.rating, created: moment().format("MMM Do YYYY") });
						db.collection('uploads').doc(info.id).update({
							reviews: reviews
						})
							.then(() => {
								context.commit('setIsLoading', false);
								context.commit('setReviewError', '');
							}).catch((error) => {
								context.commit('setIsLoading', false);
								context.commit('setReviewError', 'An error occurred. Please try again.');
								console.log(error);
							});
					}).catch(error => {
						context.commit('setIsLoading', false);
						context.commit('setReviewError', 'An error occurred. Please try again.');
						console.log(error);
					});
				} else {
					context.commit('setReviewError', 'You must be logged in to leave a review');
				}
			})
		},

		deleteUpload(context, item) {
			firebase.auth().onAuthStateChanged((user) => {
				if (user) {
					db.collection('uploads').doc(item.id).delete().then(function () {
						console.log("delete successful");
					}).catch(function (error) {
						console.log("delete unsuccessful");
					});
				}
			});
		},

		doSearch(context, keywords) {
			let strings = keywords.split(/,?\s+/);
			if (strings.includes("")) {
				strings.pop();
			}

			console.log(strings);
			var resultSet = new Set();
			var results = [];
			var allContent = context.getters.allContent;

			for (var i = 0; i < strings.length; i++) {
				for (var j = 0; j < allContent.length; j++) {
					for (var m = 0; m < allContent[j].data.tags.length; m++) {
						if (allContent[j].data.tags[m].indexOf(strings[i].toLowerCase()) >= 0 ? true : false) {
							resultSet.add(allContent[j]);
						}
					}
					let locationStrings = allContent[j].data.address.toLowerCase().split(/,?\s+/);
					for (var m = 0; m < locationStrings.length; m++) {
						if (locationStrings[m].indexOf(strings[i].toLowerCase()) >= 0 ? true : false) {
							resultSet.add(allContent[j]);
						}
					}
				}
			}
			resultSet.forEach((value) => {
				results.push(value);
			});
			context.commit('setSearchResults', results);
			return true;
		},

		doFilter(context, filters) {
			context.commit('setFilters', filters);
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

		tryAPIGeolocation(context) {
			var vm = this;
			$.post(
				"https://www.googleapis.com/geolocation/v1/geolocate?key=AIzaSyB3HKFnDKKFFCM_dTgTJGsTEOtOg3PQb04",
				function (success) {
					var userLat = success.location.lat;
					var userLng = success.location.lng;
					var coords = { lat: userLat, lng: userLng };
					vm.dispatch('distanceMatrix', coords);
				}
			).fail(function (err) {
				alert("API Geolocation error! \n\n" + err);
			});
		},
		distanceMatrix(context, userCoords) {
			var origin = { lat: userCoords.lat, lng: userCoords.lng };
			var destination = {
				lat: context.getters.expandedItemObject.data.location.lat,
				lng: context.getters.expandedItemObject.data.location.lng
			};
			var mapUrl =
				"https://maps.googleapis.com/maps/api/staticmap?size=600x300&maptype=roadmap" +
				"&markers=color:blue%7Clabel:H%7C" +
				userCoords.lat +
				"," +
				userCoords.lng +
				"&markers=color:red%7Clabel:D%7C" +
				destination.lat +
				"," +
				destination.lng +
				"&key=AIzaSyB3HKFnDKKFFCM_dTgTJGsTEOtOg3PQb04";

			context.commit('setMapUrl', mapUrl);

			var launchMapUrl = "https://www.google.com/maps/dir/?api=1&origin=" +
				userCoords.lat +
				"," +
				userCoords.lng +
				"&destination=" +
				destination.lat +
				"," +
				destination.lng +
				"&travelmode=driving";

			context.commit('setLaunchMapUrl', launchMapUrl);

			var service = new google.maps.DistanceMatrixService();
			service.getDistanceMatrix(
				{
					origins: [origin],
					destinations: [destination],
					travelMode: "DRIVING",
					unitSystem: google.maps.UnitSystem.IMPERIAL,
					avoidHighways: false,
					avoidTolls: false
				},
				function (response, status) {
					if (status !== "OK") {
						console.log("Error was: " + status);
					} else {
						context.commit('setDistance', response.rows[0].elements[0].distance.text);
						context.commit('setDuration', response.rows[0].elements[0].duration.text);
					}
				}
			);
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
			context.commit('setReviewError', '');
			context.commit('setExpandedItemObject', object);
			context.commit('setCurrReviews', object.data.reviews);
			var total = 0.0;
			if (object.data.reviews !== undefined) {
				for (var i = 0; i < object.data.reviews.length; i++) {
					total += object.data.reviews[i].rating;
				}
				var average = (total / object.data.reviews.length).toFixed(1);
				context.commit('setAverageRating', average);
			}
			if (object.id === '') {
				context.commit('setShowExpandedView', false);
			} else {
				context.commit('setShowExpandedView', true);
			}
		},

		searchForItemObject(context, id) {
			if (context.getters.expandedItemObject.id !== "") {
				return;
			}
			for (var i = 0; i < context.getters.allContent.length; i++) {
				if (context.getters.allContent[i].id === id) {
					context.commit('setExpandedItemObject', context.getters.allContent[i]);
					context.commit('setShowExpandedView', true);
					break;
				}
			}
		}
	}
});