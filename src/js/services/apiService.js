const baseUrl = 'https://pixabay.com/api/';
const API_KEY = '17911515-029745efd9a604c772829a1f1';

export default {
  page: 1,
  query: '',
  fetchImages() {
    const requestParameters = `?image_type=photo&orientation=horizontal&q=${this.query}&page=${this.page}&per_page=12&key=${API_KEY}`;

    return fetch(baseUrl + requestParameters)
      .then(response => {
        if (response.ok) {
          return response.json();
        }

        throw new Error(
          `Error ${response.statusText} while fetching "${this.query}"`,
        );
      })
      .then(parsedResponse => {
        this.incrementPage();
        return parsedResponse.hits;
      })
      .catch(error => {
        console.log('ERROR:', error);
      });
  },

  get searchQuery() {
    return this.query;
  },

  set searchQuery(string) {
    this.query = string;
  },

  incrementPage() {
    this.page += 1;
  },

  resetPage() {
    this.page = 1;
  },
};
