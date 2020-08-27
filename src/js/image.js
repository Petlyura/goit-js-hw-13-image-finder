import imageService from './services/apiService';
import spinner from './spinner';
import imageListItemsTemplate from '../templates/gallery-list-items.hbs';
import * as PNotify from '@pnotify/core';
import '@pnotify/core/dist/PNotify.css';
import '@pnotify/core/dist/BrightTheme.css';
import * as basicLightbox from 'basiclightbox';
import 'basiclightbox/dist/basicLightbox.min.css';

const refs = {
  form: document.querySelector('#search-form'),
  galleryList: document.querySelector('.gallery'),
  loadMoreBtn: document.querySelector('.load-more'),
};

refs.form.addEventListener('submit', handleFormSubmit);
refs.loadMoreBtn.addEventListener('click', handleLoadMoreBtn);
refs.galleryList.addEventListener('click', handleImageClick);

function handleFormSubmit(event) {
  event.preventDefault();

  const form = event.currentTarget;
  const input = form.elements.query;

  imageService.query = input.value;

  if (!input.value) {
    PNotify.error({
      text: 'Write something',
    });
    return;
  }

  imageService.resetPage();

  fetchImages();
  refs.loadMoreBtn.classList.remove('is-hidden');
}

function insertGalleryItems(items) {
  const markup = imageListItemsTemplate(items);
  refs.galleryList.insertAdjacentHTML('beforeend', markup);
}

function handleLoadMoreBtn() {
  fetchImages();
}

function handleImageClick(event) {
  const target = event.target;
  const largeImageUrl = target.dataset.source;

  basicLightbox
    .create(`<img src="${largeImageUrl}" width="800" height="600">`, {
      closable: true,
      onShow() {
        spinner.show();
      },
      onClose() {
        spinner.hide();
      },
    })
    .show();
}

function fetchImages() {
  spinner.show();

  imageService
    .fetchImages()
    .then(images => {
      if (images.length === 0) {
        PNotify.error({
          text: 'Ooops, try again',
        });
        spinner.hide();

        return;
      }
      spinner.hide();
      insertGalleryItems(images);
      scrollScreen();
    })
    .catch(error => {
      console.warn(error);
    });
}

function scrollScreen() {
  const scrollHeight = Math.max(
    document.body.scrollHeight,
    document.documentElement.scrollHeight,
    document.body.offsetHeight,
    document.documentElement.offsetHeight,
    document.body.clientHeight,
    document.documentElement.clientHeight,
  );
  const viewPortHeight = document.documentElement.clientHeight;

  const delta = scrollHeight - viewPortHeight * 1.7;

  console.log('viewPortHeight', viewPortHeight);
  console.log('scrollHeight', scrollHeight);
  console.log('delta', delta);

  window.scrollTo({
    top: delta,
    behavior: 'smooth',
  });
}
