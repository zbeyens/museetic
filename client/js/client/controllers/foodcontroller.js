var EntityController = require('./entitycontroller'),
    Food = require('./entities/food');

exports = module.exports = FoodController;

function FoodController() {
    EntityController.call(this);
}

FoodController.prototype = _.extend(EntityController.prototype, {
    add: function(id, mass) {
        // REVIEW: check how did I handle double food
        // if (lot.idxOf(this.entities, 'id', id) > -1) {
        //     console.log("Double food");
        // }
        var food = new Food(id, mass);
        this.entities.push(food);
        return food;
    }
});
