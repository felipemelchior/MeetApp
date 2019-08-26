import Files from '../models/files';

class FilesController {
  async index(req, res) {
    return res.json();
  }

  async store(req, res) {
    const { originalname: name, filename: path } = req.file;

    const file = await Files.create({
      name,
      path,
    });

    return res.json(file);
  }
}

export default new FilesController();
