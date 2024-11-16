const express = require('express');
const todoRouter = express.Router();
const mongoose = require('mongoose');
const UserModel = mongoose.model('UserModel');
const Task = mongoose.model('Task');
const List = mongoose.model('List');
const auth = require('../middlewares/auth');


// this will get all the lists:
todoRouter.get("/api/lists", async (req, res) => {
    try {
        const lists = await List.find().sort({ createdAt: -1 }).populate("tasks");
        res.json(lists);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// this will get all the tasks:
todoRouter.post("/api/list", auth, async (req, res) => {
    try {
        // this will validate user existence
        const user = await UserModel.findById(req.user._id);
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }
        const list = new List({ name: req.body.name });
        await list.save();

        user.lists.push(list._id);
        await user.save();

        res.json({ success: true, id: list._id });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// this will get tasks within a specific list:
todoRouter.get("/api/lists/:id/tasks", async (req, res) => {
    try {
        const list = await List.findById(req.params.id).populate("tasks");
        if (!list) {
            return res.status(404).json({ error: "List not found" });
        }
        res.json(list.tasks);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// this will add a task to a specific list:
todoRouter.post("/api/lists/:id/tasks", async (req, res) => {
    try {

        const list = await List.findByIdAndUpdate(req.params.id);

        const todo = {
            name: req.body.task,
            description: req.body.description,
            list: req.params.id,
        };

        list.tasks.push(todo);
        await list.save();
        res.json({ success: true, id: list._id });

    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// this will delete a task from a specific list:
todoRouter.delete("/api/lists/:listId/tasks/:taskId", async (req, res) => {
    try {
        //  this will find the list
        const list = await List.findById(req.params.listId);
        if (!list) {
            return res.status(404).json({ error: "List not found" });
        }

        // this will check if the task exists in the list
        const taskExists = list.tasks.some((task) => task._id.toString() === req.params.taskId);
        if (!taskExists) {
            return res.status(404).json({ error: "Task not found in list" });
        }

        //  this will find and delete the task from the list's tasks array
        list.tasks.pull({ _id: req.params.taskId });

        // this will update the list with the removed task
        await List.findByIdAndUpdate(req.params.listId, list, { new: true }); // Update the list and return the updated document

        res.json({ success: true, id: list._id });
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: err.message });
    }
});


// this will update task name and description
todoRouter.put("/api/lists/:id/tasks/:taskId", async (req, res) => {
    try {
        // this will find the list and task
        const list = await List.findById(req.params.id);
        if (!list) {
            return res.status(404).json({ error: "List not found" });
        }
        const taskToUpdate = list.tasks.find(task => task._id.toString() === req.params.taskId);
        if (!taskToUpdate) {
            return res.status(404).json({ error: "Task not found in list" });
        }


        // this will update the task properties based on request body
        const { task, description } = req.body;
        if (task) {
            taskToUpdate.name = task;
        }

        if (description) {
            taskToUpdate.description = description;
        }


        await list.save();

        res.json({ success: true, id: list._id, updatedTask: taskToUpdate });
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: err.message });
    }
});


// this will delete a list from the database
todoRouter.delete("/api/list/:id", async (req, res) => {
    try {
        const list = await List.findByIdAndDelete(req.params.id);
        if (!list) {
            return res.status(404).json({ error: "Task not found" });
        }

        const users = await UserModel.find({});


        for (const user of users) {
            user.lists = user.lists.filter(list => list.toString() !== req.params.id);
            await user.save();
        }

        res.json({ success: true });

    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});


// this will update a list Name
todoRouter.put("/api/list/:id", async (req, res) => {
    try {
        const list = await List.findByIdAndUpdate(req.params.id, {
            name: req.body.listName,
        });
        if (!list) {
            return res.status(404).json({ error: "List not found" });
        }
        res.json({ success: true });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});



// this will update checked state
todoRouter.put("/api/lists/:id/tasks/:taskId/checked", async (req, res) => {
    try {
        // this will Find the list and task
        const list = await List.findById(req.params.id);
        if (!list) {
            return res.status(404).json({ error: "List not found" });
        }
        const taskToUpdate = list.tasks.find(task => task._id.toString() === req.params.taskId);
        if (!taskToUpdate) {
            return res.status(404).json({ error: "Task not found in list" });
        }


        const { checked } = req.body;

        taskToUpdate.checked = checked;


        await list.save();

        res.json({ success: true, id: list._id, updatedTask: taskToUpdate });
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: err.message });
    }
});

// to get single user's tasks lists
todoRouter.get('/users/lists', auth, async (req, res) => {
    const userId = req.user._id;                                   // Get the user ID from the route parameter
    const user = await UserModel.findById(userId);                     // Fetch the user data
    const createdLists = user.lists;                       // Get the createdLists array from the user object

    const products = await List.find({ _id: { $in: createdLists } }).sort({ createdAt: -1 }) // Filter products by createdLists array
    res.send({ products });
}
);


// to Add list to user's data
todoRouter.post('/users/lists', auth, async (req, res) => {
    const userId = req.user.id;
    const { name } = req.body;

    // to validate user existence
    const user = await UserModel.findById(userId);
    if (!user) {
        return res.status(404).json({ message: 'User not found' });
    }

    // to create new list document
    const newList = new List({ name });

    user.lists.push(newList._id);
    await user.save();

    // to save the new list and return it
    await newList.save();
    return res.json({ list: newList });
});


module.exports = todoRouter;