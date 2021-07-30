function Carousel(containerID = '#carousel', slideID = '.slide') {
  this.container = document.querySelector(containerID);
  this.slides = this.container.querySelectorAll(slideID);
  this.interval = 1000;
}

Carousel.prototype = {
  _initProps() {
    this.slidesCount = this.slides.length;
    this.CODE_LEFT_ARROW = 'ArrowLeft';
    this.CODE_RIGHT_ARROW = 'ArrowRight';
    this.CODE_SPACE = 'Space';
    this.FA_PAUSE = '<i class="far fa-pause-circle"></i>';
    this.FA_PLAY = '<i class="far fa-play-circle"></i>';
    this.FA_PREV = '<i class="fas fa-angle-left"></i>';
    this.FA_NEXT = '<i class="fas fa-angle-right"></i>';

    this.currentSlide = 0;
    this.isPlaing = true;
    this.timerID = null;
    this.swipeStartX = null;
    this.swipeEndX = null;
  },

  _initControls() {
    const controls = document.createElement('div');
    const PAUSE = `<span id="pause-btn" class="control control-pause">${this.FA_PAUSE}</span>`;
    const PREV = `<span id="prev-btn" class="control control-prev">${this.FA_PREV}</span>`;
    const NEXT = `<span id="next-btn" class="control control-next">${this.FA_NEXT}</span>`;

    controls.setAttribute('class', 'controls');
    controls.innerHTML = PAUSE + PREV + NEXT;

    this.container.appendChild(controls);

    this.pauseBtn = this.container.querySelector('#pause-btn');
    this.prevBtn = this.container.querySelector('#prev-btn');
    this.nextBtn = this.container.querySelector('#next-btn');

    // <div id="controls-container" class="controls">
    // <span id="pause-btn" class="control control-pause"><i class="far fa-pause-circle"></i></span>
    // <span id="prev-btn" class="control control-prev"><i class="fas fa-angle-left"></i></span>
    //<span id="next-btn" class="control control-next"><i class="fas fa-angle-right"></i></span>
    //</div>
  },

  _initIndicators() {
    const indicators = document.createElement('ol');

    indicators.setAttribute('class', 'indicators');

    for (let i = 0, n = this.slidesCount; i < n; i++) {
      const indicator = document.createElement('li');

      indicator.setAttribute('class', 'indicator');
      indicator.dataset.slideTo = `${i}`;
      i === 0 && indicator.classList.add('active');

      indicators.appendChild(indicator);
    }

    this.container.appendChild(indicators);

    //<div id="indicators-container" class="indicators">
    //<div class="indicator active" data-slide-to="0"></div>
    //<div class="indicator" data-slide-to="1"></div>
    //<div class="indicator" data-slide-to="2"></div>
    //<div class="indicator" data-slide-to="3"></div>
    //<div class="indicator" data-slide-to="4"></div>
    //</div>

    this.indContainer = this.container.querySelector('.indicators');
    this.indItems = this.indContainer.querySelectorAll('.indicator');
  },

  _initListeners() {
    this.pauseBtn.addEventListener('click', this.pausePlay.bind(this)); // либо стрелочная функция
    this.prevBtn.addEventListener('click', this.prev.bind(this));
    this.nextBtn.addEventListener('click', this.next.bind(this));
    this.indContainer.addEventListener('click', this._indicate.bind(this));
    document.addEventListener('keydown', this._pressKey.bind(this));
  },

  _gotoNth(n) {
    this.slides[this.currentSlide].classList.toggle('active');
    this.indItems[this.currentSlide].classList.toggle('active');
    this.currentSlide = (n + this.slidesCount) % this.slidesCount;
    this.slides[this.currentSlide].classList.toggle('active');
    this.indItems[this.currentSlide].classList.toggle('active');
  },

  _gotoPrev() {
    this._gotoNth(this.currentSlide - 1);
  },

  _gotoNext() {
    this._gotoNth(this.currentSlide + 1);
  },

  _pause() {
    if (this.isPlaing) {
      clearInterval(this.timerID);
      this.isPlaing = false;
      this.pauseBtn.innerHTML = this.FA_PLAY;
    }
  },

  _play() {
    console.log(this);
    this.timerID = setInterval(() => this._gotoNext(), this.interval);
    this.isPlaing = true;
    this.pauseBtn.innerHTML = this.FA_PAUSE;
  },

  pausePlay() {
    if (this.isPlaing) this._pause();
    else this._play();
  },

  _indicate(e) {
    const target = e.target;
    if (target && target.classList.contains('indicator')) {
      this._pause();
      this._gotoNth(+target.dataset.slideTo);
    }
  },

  _pressKey(e) {
    if (e.code === this.CODE_LEFT_ARROW) this.prev();
    if (e.code === this.CODE_RIGHT_ARROW) this.next();
    if (e.code === this.CODE_SPACE) this.pausePlay();
    console.log(e);
  },

  prev() {
    this._pause();
    this._gotoPrev();
  },

  next() {
    this._pause();
    this._gotoNext();
  },

  init() {
    this._initProps();
    this._initControls();
    this._initIndicators();
    this._initListeners();
    this.timerID = setInterval(() => this._gotoNext(), this.interval);
  },
};

function SwipeCarousel() {
  Carousel.apply(this, arguments);
}

SwipeCarousel.prototype = Object.create(Carousel.prototype);
SwipeCarousel.prototype.constructor = SwipeCarousel;

SwipeCarousel.prototype._swipeStart = function (e) {
  this.swipeStartX = e.changedTouches[0].pageX;
};

SwipeCarousel.prototype._swipeEnd = function (e) {
  this.swipeEndX = e.changedTouches[0].pageX;
  if (this.swipeStartX - this.swipeEndX > 100) this.next(); //swipeStartX - swipeEndX > 100 && next();
  if (this.swipeStartX - this.swipeEndX < -100) this.prev();
};

SwipeCarousel.prototype._initListeners = function () {
  Carousel.prototype._initListeners.apply(this);
  this.container.addEventListener('touchstart', this._swipeStart.bind(this));
  this.container.addEventListener('touchend', this._swipeEnd.bind(this));
};
