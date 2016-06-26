﻿(function () {

    var index = angular.module("index", ["oi.file"]);

    index.factory("data", function ($http) {
        var data = {
            loadCategories: function (callback) {
                $http({
                    method: "GET",
                    url: "Categories/List"
                }).then(function (response) {
                    data.categories = response.data;
                    callback();
                });
            },

            addCategory: function (name) {
                $http({
                    method: "POST",
                    url: "Categories/Add",
                    params: {
                        name: name
                    }
                }).then(function (response) {
                    data.categories.push({
                        Id: response.data.Id,
                        Name: name
                    });
                });
            },

            renameCategory: function (category, name) {
                $http({
                    method: "POST",
                    url: "Categories/Update",
                    params: {
                        id: category.Id,
                        name: name
                    }
                }).then(function (response) {
                    category.Name = name;
                });
            },

            deleteCategory: function (category) {
                $http({
                    method: "POST",
                    url: "Categories/Delete",
                    params: {
                        id: category.Id
                    }
                }).then(function (response) {
                    var index = data.categories.indexOf(category);
                    data.categories.splice(index, 1);
                });
            },

            loadTasks: function (category) {
                data.tasks = [];

                $http({
                    method: "GET",
                    url: "Tasks/List",
                    params: {
                        categoryId: category ? category.Id : null
                    }
                }).then(function (response) {
                    data.tasks = [];
                    response.data.forEach(function (c) {
                        var category = data.categories.find(function (i) {
                            return i.Id == c.Id
                        });
                        c.Tasks.forEach(function (task) {
                            task.Category = category;
                            data.tasks.push(task);
                        });
                    });
                    data.tasks.forEach(function (task) {
                        if (task.DateTime) {
                            task.DateTime = new Date(parseInt(task.DateTime.substr(6)));
                        }
                    });
                });
            },

            addTask: function (name, dateTime, priority, category) {
                $http({
                    method: "POST",
                    url: "Tasks/Add",
                    params: {
                        name: name,
                        dateTime: dateTime,
                        priority: priority,
                        categoryId: category.Id
                    }
                }).then(function (response) {
                    response.data.Category = data.categories.find(function (i) {
                        return i.Id == response.data.CategoryId
                    });
                    delete response.data.CategoryId;
                    if (response.data.DateTime) {
                        response.data.DateTime = new Date(parseInt(response.data.DateTime.substr(6)));
                    }
                    data.tasks.push(response.data);
                });
            },

            changeTask: function (id, name, completed, priority, dateTime) {
                $http({
                    method: "POST",
                    url: "Tasks/Update",
                    params: {
                        id: id,
                        name: name,
                        completed: completed,
                        priority: priority,
                        dateTime: dateTime
                    }
                }).then(function (response) {
                    response.data.Category = data.categories.find(function (i) {
                        return i.Id == response.data.CategoryId
                    });
                    delete response.data.CategoryId;
                    if (response.data.DateTime) {
                        response.data.DateTime = new Date(parseInt(response.data.DateTime.substr(6)));
                    }
                    var ind = data.tasks.findIndex(function (task) {
                        return task.Id == response.data.Id;
                    });
                    data.tasks[ind] = response.data;
                });
            },

            deleteTask: function (task) {
                $http({
                    method: "POST",
                    url: "Tasks/Delete",
                    params: {
                        id: task.Id
                    }
                }).then(function (response) {
                    var index = data.tasks.findIndex(function (task) {
                        return task.Id == response.data.Id
                    });
                    data.tasks.splice(index, 1);
                });
            },

            loadNotes: function (task, callback) {
                $http({
                    method: "POST",
                    url: "Tasks/LoadNotes",
                    params: {
                        id: task.Id
                    }
                }).then(function (response) {
                    callback(response.data.Notes);
                });
            },

            saveNotes: function (task, notes, callback) {
                $http({
                    method: "POST",
                    url: "Tasks/UpdateNotes",
                    params: {
                        id: task.Id,
                        notes: notes ? notes : ""
                    }
                }).then(function (response) {
                    callback();
                });
            },

            addSubtask: function (task, name) {
                $http({
                    method: "POST",
                    url: "Tasks/AddSubtask",
                    params: {
                        taskId: task.Id,
                        name: name
                    }
                }).then(function (response) {
                    task.Subtasks.push(response.data);
                });
            },

            updateSubtask: function (task, subtask, name, completed) {
                $http({
                    method: "POST",
                    url: "Tasks/UpdateSubtask",
                    params: {
                        subtaskId: subtask.Id,
                        name: name,
                        completed: completed
                    }
                }).then(function (response) {
                    subtask.Name = response.data.Name;
                    subtask.Completed = response.data.Completed;
                });
            },

            deleteSubtask: function (task, subtask) {
                $http({
                    method: "POST",
                    url: "Tasks/DeleteSubtask",
                    params: {
                        taskId: task.Id,
                        subtaskId: subtask.Id
                    }
                }).then(function (response) {
                    var index = task.Subtasks.findIndex(function (st) {
                        return st.Id == subtask.Id;
                    });
                    task.Subtasks.splice(index, 1);
                });
            },

            sendEmails: function (task, emails, callback) {
                $http({
                    method: "POST",
                    url: "Tasks/SendEmails",
                    params: {
                        taskId: task.Id,
                        emails: emails
                    }
                }).then(function (response) {
                    callback();
                });
            },

            loadAttachments: function (task, callback) {
                $http({
                    method: "POST",
                    url: "Attachments/List",
                    params: {
                        taskId: task.Id
                    }
                }).then(function (response) {
                    if (!response.data) response.data = [];
                    callback(response.data);
                });
            },

            deleteAttachment: function (attachment, attachments) {
                $http({
                    method: "POST",
                    url: "Attachments/Delete",
                    params: {
                        id: attachment.Id
                    }
                }).then(function (response) {
                    var index = attachments.indexOf(attachment);
                    attachments.splice(index, 1);
                });
            }
        };
        return data;
    });

    index.factory("searchTasks", function () {
        return function (task, search) {
            if (!search || search == "") {
                return true;
            }
            var searchU = search.toUpperCase();
            return task.Name.toUpperCase().includes(searchU)
                || task.Subtasks.some(function (subtask) {
                    return subtask.Name.toUpperCase().includes(searchU);
                });
        };
    });

    index.factory("viewFunctions", function () {
        var viewFunctions = {
            init: function ($scope) {
                $scope.taskForEdit = null;
                $scope.editingNewTask = false;
            },

            onEditTaskClicked: function (task, $scope) {
                $scope.taskForEdit = task;
                $scope.editingNewTask = false;
            },

            onTaskEdited: function ($scope) {
                $scope.taskForEdit = null;
                $scope.editingNewTask = false;
            }
        };
        return viewFunctions;
    });

    index.controller("indexCtrl", function ($scope, data) {

        data.loadCategories(function () {
            $scope.categories = data.categories;
            data.loadTasks(null);
        });

        $scope.views = {
            categories: 1,
            time: 2,
            list: 3,
            priority: 4
        };

        $scope.selectedCategory = null;
        $scope.selectedView = $scope.views.categories;

        $scope.selectAllCategories = function () {
            $scope.selectedView = $scope.views.time;
            $scope.selectedCategory = null;
            data.loadTasks(null);
        };

        $scope.selectCategory = function (category) {
            $scope.selectedCategory = category;
            $scope.selectedView = $scope.views.time;
            data.loadTasks(category);
        };
    });

    index.component("categories", {
        templateUrl: "Templates/Categories.html",
        controller: function ($scope, data) {
            var ctrl = this;

            $scope.showAddCategory = false;

            $scope.$watch(
            function () { return data.categories; },
            function () {
                $scope.categories = data.categories;
            });

            $scope.addCategory = function () {
                $scope.showAddCategory = false;
                if ($scope.addCategoryName) {
                    data.addCategory($scope.addCategoryName);
                }
            };

            $scope.renameCategory = function () {
                var childScope = this;
                $scope.rowRenameCategory = null;
                if (childScope.newCategoryName) {
                    data.renameCategory(childScope.category, childScope.newCategoryName);
                }
            };

            $scope.deleteCategory = function () {
                var childScope = this;
                $scope.rowRenameCategory = null;
                $scope.showAddCategory = false;
                data.deleteCategory(childScope.category);
            };
        },
        bindings: {
            onSelectAllCategories: "&",
            onSelectCategory: "&"
        }
    });

    index.component("taskList", {
        templateUrl: "Templates/TaskList.html",
        controller: function ($scope, data) {
            var ctrl = this;

            $scope.addTask = function () {
                ctrl.onAddTask();
            };

            $scope.onTaskComplete = function (task, taskCompleted) {
                data.changeTask(task.Id, task.Name, taskCompleted, task.Priority, task.DateTime);
            };

            $scope.onTaskDelete = function (task) {
                data.deleteTask(task);
            };
        },
        bindings: {
            caption: "@",
            tasks: "<",
            onAddTask: "&",
            onEditTaskClicked: "&"
        }
    });

    index.component("timeView", {
        templateUrl: "Templates/TimeView.html",
        controller: function ($scope, data, searchTasks, viewFunctions) {
            var ctrl = this;

            var today = new Date();
            today = new Date(today.getFullYear(), today.getMonth(), today.getDate());
            var tomorrow = new Date(today.getTime() + 24 * 60 * 60 * 1000);
            var twodays = new Date(tomorrow.getTime() + 24 * 60 * 60 * 1000);

            $scope.today = today;
            $scope.tomorrow = tomorrow;
            $scope.twodays = twodays;

            $scope.$watch(function () {
                return [data.tasks, ctrl.search];
            },
            function () {
                $scope.todaysTasks = data.tasks.filter(function (task) {
                    return task.DateTime && task.DateTime < tomorrow
                        && searchTasks(task, ctrl.search);
                });
                $scope.tomorrowsTasks = data.tasks.filter(function (task) {
                    return task.DateTime && task.DateTime >= tomorrow && task.DateTime < twodays
                        && searchTasks(task, ctrl.search);
                });
                $scope.upcomingTasks = data.tasks.filter(function (task) {
                    return task.DateTime && task.DateTime >= twodays
                        && searchTasks(task, ctrl.search);
                });
                $scope.someDayTasks = data.tasks.filter(function (task) {
                    return !task.DateTime
                        && searchTasks(task, ctrl.search);
                });
            },
            true);

            viewFunctions.init($scope);

            $scope.onAddTaskClicked = function (tag) {
                var category = null;
                if (ctrl.selectedCategory) {
                    category = ctrl.selectedCategory;
                }
                else {
                    category = data.categories[0];
                }
                $scope.taskForEdit = {
                    Name: "",
                    DateTime: tag,
                    Priority: false,
                    Category: category
                };
                $scope.editingNewTask = true;
            };

            $scope.onEditTaskClicked = function (task) {
                viewFunctions.onEditTaskClicked(task, $scope);
            };

            $scope.onTaskEdited = function () {
                viewFunctions.onTaskEdited($scope);
            };
        },
        bindings: {
            selectedCategory: "<",
            search: "<"
        }
    });

    index.component("listView", {
        templateUrl: "Templates/ListView.html",
        controller: function ($scope, data, searchTasks, viewFunctions) {
            var ctrl = this;

            var today = new Date();
            today = new Date(today.getFullYear(), today.getMonth(), today.getDate());

            $scope.today = today;

            $scope.$watch(function () {
                return data.categories;
            },
            function () {
                $scope.categories = data.categories;
            });

            $scope.$watch(function () {
                return [data.tasks, ctrl.search];
            },
            function () {
                if (!ctrl.selectedCategory) {
                    $scope.tasksByList = [];
                    data.categories.forEach(function (category) {
                        $scope.tasksByList.push(data.tasks.filter(function (task) {
                            return task.Category == category && searchTasks(task, ctrl.search);
                        }));
                    });
                }
                else {
                    $scope.tasks = data.tasks.filter(function (task) {
                        return searchTasks(task, ctrl.search);
                    });
                }
            },
            true);

            viewFunctions.init($scope);

            $scope.onAddTaskClicked = function (tag) {
                $scope.taskForEdit = {
                    name: "",
                    DateTime: today,
                    Priority: false,
                    Category: tag
                };
                $scope.editingNewTask = true;
            };

            $scope.onEditTaskClicked = function (task) {
                viewFunctions.onEditTaskClicked(task, $scope);
            };

            $scope.onTaskEdited = function () {
                viewFunctions.onTaskEdited($scope);
            };
        },
        bindings: {
            selectedCategory: "<",
            search: "<"
        }
    });

    index.component("priorityView", {
        templateUrl: "Templates/PriorityView.html",
        controller: function ($scope, data, searchTasks, viewFunctions) {
            var ctrl = this;

            var today = new Date();
            today = new Date(today.getFullYear(), today.getMonth(), today.getDate());

            $scope.today = today;

            $scope.$watch(function () {
                return [data.tasks, ctrl.search];
            },
            function () {
                $scope.priorityTasks = data.tasks.filter(function (task) {
                    return task.Priority && searchTasks(task, ctrl.search);
                });
                $scope.normalTasks = data.tasks.filter(function (task) {
                    return !task.Priority && searchTasks(task, ctrl.search);
                });
            },
            true);

            viewFunctions.init($scope);

            $scope.onAddTaskClicked = function (tag) {
                var category = null;
                if (ctrl.selectedCategory) {
                    category = ctrl.selectedCategory;
                }
                else {
                    category = data.categories[0];
                }
                $scope.taskForEdit = {
                    Name: "",
                    DateTime: today,
                    Priority: tag,
                    Category: category
                };
                $scope.editingNewTask = true;
            };

            $scope.onEditTaskClicked = function (task) {
                viewFunctions.onEditTaskClicked(task, $scope);
            };

            $scope.onTaskEdited = function () {
                viewFunctions.onTaskEdited($scope);
            };
        },
        bindings: {
            selectedCategory: "<",
            search: "<"
        }
    });

    index.component("taskEdit", {
        templateUrl: "Templates/TaskEdit.html",
        controller: function ($scope, data) {
            var ctrl = this;

            ctrl.$onChanges = function () {
                if (ctrl.task) {
                    $scope.taskName = ctrl.task.Name;
                    $scope.taskPriority = ctrl.task.Priority;
                    if (!ctrl.editingNewTask) {
                        data.loadNotes(ctrl.task, function (notes) {
                            $scope.notes = notes;
                        });
                        data.loadAttachments(ctrl.task, function (attachments) {
                            $scope.attachments = attachments;
                        });
                    }
                }
                $scope.selectedItem = $scope.items.notes;
            }

            $scope.items = {
                notes: 1,
                subtasks: 2,
                share: 3,
                attachments: 4
            };

            $scope.onOKClicked = function () {
                if (ctrl.editingNewTask) {
                    onTaskEdited();
                }
                else {
                    data.saveNotes(ctrl.task, $scope.notes, function () {
                        onTaskEdited();
                    });
                }
            };

            function onTaskEdited() {
                if ($scope.taskName && $scope.taskName != "") {
                    if (ctrl.editingNewTask) {
                        data.addTask($scope.taskName, ctrl.task.DateTime, $scope.taskPriority, ctrl.task.Category);
                    }
                    else {
                        data.changeTask(ctrl.task.Id, $scope.taskName, ctrl.task.Completed, $scope.taskPriority,
                            ctrl.task.DateTime);
                    }
                }
                ctrl.onTaskEdited();
            }

            $scope.addSubtask = function () {
                if ($scope.newSubtaskName && $scope.newSubtaskName != "") {
                    data.addSubtask(ctrl.task, $scope.newSubtaskName);
                    $scope.newSubtaskName = "";
                }
            };

            $scope.completeSubtask = function () {
                var childScope = this;
                data.updateSubtask(ctrl.task,
                    childScope.subtask,
                    childScope.subtask.Name,
                    childScope.subtaskCompleted);
            };

            $scope.renameSubtask = function () {
                var childScope = this;
                if (childScope.subtaskName && childScope.subtaskName != "") {
                    data.updateSubtask(ctrl.task,
                        childScope.subtask,
                        childScope.subtaskName,
                        childScope.subtask.Completed);
                }
                $scope.subtaskToRename = null;
            };

            $scope.deleteSubtask = function () {
                var childScope = this;
                data.deleteSubtask(ctrl.task, childScope.subtask);
            };

            $scope.emails = [];

            $scope.addEmailAddress = function () {
                if ($scope.addAddress) {
                    $scope.emails.push($scope.addAddress);
                }
                $scope.addAddress = null;
            };

            $scope.removeEmailAddress = function () {
                var childScope = this;
                $scope.emails.splice(childScope.$index, 1);
            };

            $scope.emailsHaveBeenSent = false;
            $scope.sendEmails = function () {
                if ($scope.emails.length > 0) {
                    data.sendEmails(ctrl.task, $scope.emails, function () {
                        $scope.emailsHaveBeenSent = true;
                    });
                }
            };

            $scope.file = {};
            $scope.fileUploadOptions = {
                change: function (file) {
                    file.$upload("Attachments/Upload?taskId=" + ctrl.task.Id, $scope.file)
                        .then(function (response) {
                            $scope.attachments.push(response.data);
                        });
                }
            };

            $scope.deleteAttachment = function () {
                var childScope = this;
                data.deleteAttachment(childScope.attachment, $scope.attachments);
            };
        },
        bindings: {
            task: "<",
            editingNewTask: "<",
            onTaskEdited: "&"
        }
    });
})();