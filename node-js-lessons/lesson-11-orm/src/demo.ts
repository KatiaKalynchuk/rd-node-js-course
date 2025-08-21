import { productRepo } from './repositories/product.repo';

async function demo() {
  try {
    console.log('--- save ---');
    const newProduct = await productRepo.save({ name: 'Apple', price: 100 });
    console.log(newProduct);

    console.log('--- find ---');
    const products = await productRepo.find();
    console.log(products);

    console.log('--- update ---');
    const updated = await productRepo.update(newProduct.id, { price: 120 });
    console.log(updated);

    console.log('--- delete ---');
    await productRepo.delete(newProduct.id);

    console.log('--- findOne ---');
    const deleted = await productRepo.findOne(newProduct.id);
    console.log(deleted); // null
  } catch (err) {
    console.error(err);
  } finally {
    await productRepo['pool'].end();
  }
}

demo().catch((err) => {
  console.error('Error:', err);
});
