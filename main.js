//import Carousel from './carousel.js';

let carousel = new SwipeCarousel({
 containerID: '#test',
 slideID: '.item',
 interval: 1000,
 //isPlaying: false
}); 

//let carousel = new Carousel('#custom-id', '.item');

carousel.init();