exports.up = function(next) {
    this.createTable('user', {
        id: {
            type: "serial",
            key: true
        }, // auto increment
        user_name: {
            type: "text",
            required: true,
            unique: true
        },
        password: {
            type: "text",
            required: true
        },
        first_name: {
            type: "text",
            required: true
        },
        second_name: {
            type: "text",
            required: true
        },
        height: {
            type: "integer",
            size: 4,
            required: true
        },
        sex: {
            type: "integer",
            size: 2,
            required: true
        },
        age: {
            type: "integer",
            size: 2,
            required: true
        },
        about_myself: {
            type: "text"
        },
        tour_id: {
            type: "integer",
            size: 4,
            defaultValue: 0
        },
        admin: {
            type: "integer",
            size: 2,
            defaultValue: 0
        },
        approved: {
            type: "integer",
            size: 2,
            defaultValue: 0
        },
        created_at: {
            type: "date",
            time: true
        }
    }, next);
};

exports.down = function(next) {
    this.dropTable('user', next);
};