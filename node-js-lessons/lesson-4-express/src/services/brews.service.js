const filtersMap = {
  method: (value) => (brew) => brew.method === value,
  ratingMin: (value) => (brew) => brew.rating >= value,
};

export function filteredBrews(brews, query = {}) {
  const activeFilters = Object.entries(query)
    .filter(([key, value]) => value && filtersMap[key])
    .map(([key, value]) => filtersMap[key](value));

  return brews.filter(brew => activeFilters.every(fn => fn(brew)));
}

export class BrewsService {
  static scope = 'scoped';

  constructor({ brewsModel }) {
    this.brewsModel = brewsModel;
  }

  getAll(query = {}) {
    const brews = this.brewsModel.all();

    return filteredBrews(brews, query);
  }

  getOne(id) {
    const brew = this.brewsModel.find(id);
    if (!brew)
      throw Object.assign(new Error('Brew not found'), { status: 404 });
    return brew;
  }

  create(dto) {
    return this.brewsModel.create(dto);
  }

  update(id, dto) {
    const brew = this.brewsModel.update(id, dto);
    if (!brew)
      throw Object.assign(new Error('Brew not found'), { status: 404 });
    return brew;
  }

  delete(id) {
    const removed = this.brewsModel.remove(id);
    if (!removed)
      throw Object.assign(new Error('Brew not found'), { status: 404 });
  }
}
