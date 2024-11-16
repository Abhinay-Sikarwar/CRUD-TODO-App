const mongoose = require("mongoose");
const { ObjectId } = mongoose.Schema.Types;    // from mongoose datatypes


const TaskSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
    },
    description: {
        type: String,
        // required: true,
    },
    checked: {
        type: Boolean,
        default: false,
    },
    list: {
        type: ObjectId,
        ref: "List",
    },
}, { timestamps: true });



const ListSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
    },
    tasks: [TaskSchema],
}, { timestamps: true });



// Create the task and list model
mongoose.model("Task", TaskSchema);
mongoose.model("List", ListSchema);
