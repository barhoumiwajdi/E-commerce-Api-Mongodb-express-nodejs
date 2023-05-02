const category = require('../Models/CatgeoryModel')
const product = require('../Models/ProductModel')
exports.getcategory = async (req, res) => {
  try {
    const categories = await category.find()
    res.status(200).send({ message: 'list of category', categories })
  } catch (error) {
    res.status(500).send({ message: 'error server' })
  }
}
exports.getbyIDcategory = async (req, res) => {
  try {
    const category = await category.findById(req.params.id).populate('Products', 'Name')
    res.status(200).send({
      message: 'the desired category', category
    })
  } catch (error) {
    res.status(500).send({ message: 'error server' })
  }
}
exports.addcategory = async (req, res) => {
  try {
    const found = await category.findOne({ Name: req.body.Name })
    if (found) {
      res.status(400).send({ message: 'category name already exist please use different name' })
    }
    else {
      await category.create(req.body)
      res.status(200).send({ message: 'category added succefully' })
    }
  } catch (error) {
    res.status(500).send({ message: 'error server' })
  }
}
exports.updatecategory = async (req, res) => {
  try {
    await category.findByIdAndUpdate(req.params.id, req.body)
    res.status(200).send({ message: 'category updated' })
  } catch (error) {
    res.status(500).send({ message: 'error server' })
  }
}
exports.deletecategory = async (req, res) => {
  try {
    await category.findByIdAndDelete(req.params.id)
    res.status(200).send({ message: 'category deleted' })
  } catch (error) {
    res.status(500).send({ message: 'error server' })
  }
}

exports.addparentcategories = async (req, res) => {
  try {
    const foundCategory = await category.findById(req.params.id)
    if (foundCategory) {
      const parentCategory = await category.findById(req.params.categoryId)
      if (parentCategory) {
        await category.findByIdAndUpdate(foundCategory._id, { ParentCategory: parentCategory._id }, { new: true })
        res.status(200).send({ message: 'La catégorie parente a été ajoutée avec succès' })
      }
      else {
        res.status(404).send({ message: 'La catégorie parente spécifiée n\'existe pas' })
      }
    } else {
      res.status(404).send({ message: 'La catégorie spécifiée n\'existe pas' })
    }

  } catch (error) {
    res.status(500).send({ message: error.message || 'error serveur ' })
  }
}
exports.getProductsbycategory = async (req, res) => {
  try {
    const foundCategory = await category.findById(req.params.id).populate('Products')
    if (foundCategory) {
      const products = foundCategory.Products
      // const result = products.map(product => product.Name);
      res.status(200).send({ message: 'liste de produits de la categorie demandé', products })

    } else {
      res.status(404).send({ message: 'Catégorie non trouvée' });
    }
  } catch (error) {
    res.status(500).send({ message: 'error serveur' || error })
  }
}