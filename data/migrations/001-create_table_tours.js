exports.up = function(next) {
    this.createTable('tour', {
        id: {
            type: "serial",
            key: true
        }, // auto increment
        name: {
            type: "text",
            required: true
        },
        short_name: {
            type: "text",
            required: true
        },
        created_at: {
            type: "date",
            time: true
        }
    }, next);
};

exports.down = function(next) {
    this.dropTable('tour', next);
};