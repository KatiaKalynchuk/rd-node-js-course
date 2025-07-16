export default class BrewsController {
  constructor({ brewsService }) {
    this.brewsService = brewsService;
  }

  index = (req, res) => {
    res.json(this.brewsService.getAll(req.query));
  };

  getAll = (req, res, next) => {
    try {
      const brews = this.brewsService.getAll(req.query);
      res.json(brews);
    } catch (err) {
      next(err);
    }
  };

  getById = (req, res, next) => {
    try {
      const brew = this.brewsService.getOne(req.params.id);
      res.json(brew);
    } catch (err) {
      next(err);
    }
  };

  create = (req, res, next) => {
    try {
      const brew = this.brewsService.create(req.body);
      res.status(201).json(brew);
    } catch (err) {
      next(err);
    }
  };

  update = (req, res, next) => {
    try {
      const updated = this.brewsService.update(req.params.id, req.body);
      res.json(updated);
    } catch (err) {
      next(err);
    }
  };

  delete = (req, res, next) => {
    try {
      this.brewsService.delete(req.params.id);
      res.sendStatus(204);
    } catch (err) {
      next(err);
    }
  };
}
