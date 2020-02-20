const Model = require('../lib/base/model');

// console.log(Model);


class Car extends Model {
    static get fillable() {
        return ['name'];
    }
}

Car.initialize();


(async function() {
    let collections = await Car.where('name', 'Mercedes').getData();
    
    console.log(collections);
    let car = await Car.find(1)
    car.name = 'Audi';
    await car.save();

    // console.log(collections[0].query.toSQL());
    // collections[0].name = 'con gax';
    // await collections[0].save();
    
    // console.log(collections);
    
    // let car = new Car({
    //     name: 'Con ga',
    //     price: 12
    // });
    // console.log(car);
    // await car.save();
    // await car.del();

    // console.log(car);
    

    require('../lib/db').destroy();
})();

//console.log(c.constructor.fillable)); 
//.then(raw => {
    // console.log(Car.currentBuilder);
// });
// Car.select('name', 'price').orderBy('price', 'desc').then(function() {
//     console.log('inner');
//     Car.currentBuilder.then(console.log);
// });
// car.where('id', 1).then(console.log);
