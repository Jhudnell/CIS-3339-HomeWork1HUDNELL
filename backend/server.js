const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');
require('dotenv').config();

const app = express();
app.use(cors());
app.use(express.json());

// Student database model
const studentSchema = new mongoose.Schema({
    name: { type: String, required: true, trim: true },
    id: { type: String, required: true, unique: true, trim: true },
    phone: { type: String, required: true, trim: true },
    zip: { type: String, required: true, trim: true }
});

const Student = mongoose.model('Student', studentSchema);

// Search for a student by name
app.post('/find-student', async (req, res) => {
    try {
        const { name } = req.body;

        if (!name || !name.trim()) {
            return res.status(400).send({ error: 'Student name is required' });
        }

        const student = await Student.findOne({ name: name.trim() });

        if (!student) {
            return res.status(404).send({ error: 'Student not found' });
        }

        res.send(student);
    } catch (error) {
        console.error('Error finding student:', error);
        res.status(500).send({ error: 'Internal server error' });
    }
});

// Add a student
app.post('/add-student', async (req, res) => {
    try {
        const { name, id, phone, zip } = req.body;

        if (![name, id, phone, zip].every(value =>
            typeof value === 'string' && value.trim()
        )) {
            return res.status(400).send({
                error: 'All fields (name, id, phone, zip) are required'
            });
        }

        const newStudent = await Student.create({
            name: name.trim(),
            id: id.trim(),
            phone: phone.trim(),
            zip: zip.trim()
        });

        res.status(201).send({
            message: 'Student added successfully',
            student: newStudent
        });
    } catch (error) {
        if (error.code === 11000) {
            return res.status(409).send({
                error: 'A student with this ID already exists'
            });
        }

        if (error.name === 'ValidationError') {
            return res.status(400).send({ error: error.message });
        }

        console.error('Error adding student:', error);
        res.status(500).send({ error: 'Internal server error' });
    }
});

// List all students
app.get('/students', async (req, res) => {
    try {
        const students = await Student.find().sort({ name: 1 });
        res.send(students);
    } catch (error) {
        console.error('Error listing students:', error);
        res.status(500).send({ error: 'Internal server error' });
    }
});

// Delete a student by name
app.post('/delete-student', async (req, res) => {
    try {
        const { name } = req.body;

        if (!name || !name.trim()) {
            return res.status(400).send({ error: 'Student name is required' });
        }

        const student = await Student.findOne({
    name: name.trim()
});

if (!student) {
    return res.status(404).send({
        error: 'Student not found'
    });
}

// Delete this student's enrollments first
await Enrollment.deleteMany({
    student: student._id
});

// Then delete the student
const deletedStudent = await Student.findByIdAndDelete(
    student._id
);

res.send({
    message: 'Student deleted successfully',
    student: deletedStudent
});
} catch (error) {
    console.error('Error deleting student:', error);
    res.status(500).send({ error: 'Internal server error' });
}
});
// Course database model
const courseSchema = new mongoose.Schema({
    courseId: {
        type: String,
        required: true,
        unique: true,
        trim: true
    },
    name: {
        type: String,
        required: true,
        trim: true
    }
});

const Course = mongoose.model('Course', courseSchema);

// List all courses
app.get('/courses', async (req, res) => {
    try {
        const courses = await Course.find().sort({ courseId: 1 });
        res.send(courses);
    } catch (error) {
        console.error('Error listing courses:', error);
        res.status(500).send({ error: 'Could not load courses' });
    }
});

// Add a course
app.post('/courses', async (req, res) => {
    try {
        const { courseId, name } = req.body;

        if (
            typeof courseId !== 'string' || !courseId.trim() ||
            typeof name !== 'string' || !name.trim()
        ) {
            return res.status(400).send({
                error: 'Course ID and course name are required'
            });
        }

        const course = await Course.create({
            courseId: courseId.trim(),
            name: name.trim()
        });

        res.status(201).send({
            message: 'Course added successfully',
            course
        });
    } catch (error) {
        if (error.code === 11000) {
            return res.status(409).send({
                error: 'A course with this ID already exists'
            });
        }

        if (error.name === 'ValidationError') {
            return res.status(400).send({ error: error.message });
        }

        console.error('Error adding course:', error);
        res.status(500).send({ error: 'Could not add course' });
    }
});

// Delete a course and its enrollments
app.delete('/courses/:courseId', async (req, res) => {
    try {
        const course = await Course.findOne({
            courseId: req.params.courseId
        });

        if (!course) {
            return res.status(404).send({
                error: 'Course not found'
            });
        }

        // Delete this course's enrollments first
        await Enrollment.deleteMany({
            course: course._id
        });

        // Then delete the course
        await Course.findByIdAndDelete(course._id);

        res.send({
            message: 'Course deleted successfully',
            course
        });
    } catch (error) {
        console.error('Error deleting course:', error);
        res.status(500).send({
            error: 'Could not delete course'
        });
    }
});// Enrollment database model
const enrollmentSchema = new mongoose.Schema({
    student: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Student',
        required: true
    },
    course: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Course',
        required: true
    }
});

// Prevent enrolling the same student in the same course twice
enrollmentSchema.index(
    { student: 1, course: 1 },
    { unique: true }
);

const Enrollment = mongoose.model('Enrollment', enrollmentSchema);

// List all enrollments
app.get('/enrollments', async (req, res) => {
    try {
        const enrollments = await Enrollment.find()
            .populate('student', 'name id')
            .populate('course', 'courseId name');

        res.send(enrollments);
    } catch (error) {
        console.error('Error listing enrollments:', error);
        res.status(500).send({
            error: 'Could not load enrollments'
        });
    }
});

// Enroll a student in a course
app.post('/enrollments', async (req, res) => {
    try {
        const { studentId, courseId } = req.body;

        if (!studentId || !courseId) {
            return res.status(400).send({
                error: 'Student and course are required'
            });
        }

        const student = await Student.findById(studentId);
        if (!student) {
            return res.status(404).send({
                error: 'Student not found'
            });
        }

        const course = await Course.findById(courseId);
        if (!course) {
            return res.status(404).send({
                error: 'Course not found'
            });
        }

        const enrollment = await Enrollment.create({
            student: student._id,
            course: course._id
        });

        res.status(201).send({
            message: 'Student enrolled successfully',
            enrollment
        });
    } catch (error) {
        if (error.code === 11000) {
            return res.status(409).send({
                error: 'This student is already enrolled in this course'
            });
        }

        if (error.name === 'ValidationError' ||
            error.name === 'CastError') {
            return res.status(400).send({
                error: 'Invalid student or course'
            });
        }

        console.error('Error creating enrollment:', error);
        res.status(500).send({
            error: 'Could not enroll student'
        });
    }
});

// View the roster for a course
app.get('/courses/:courseId/roster', async (req, res) => {
    try {
        const course = await Course.findById(req.params.courseId);

        if (!course) {
            return res.status(404).send({
                error: 'Course not found'
            });
        }

        const enrollments = await Enrollment.find({
            course: course._id
        }).populate('student', 'name id phone zip');

        res.send(enrollments);
    } catch (error) {
        console.error('Error loading course roster:', error);
        res.status(500).send({
            error: 'Could not load course roster'
        });
    }
});
// Connect to MongoDB before starting the server
const PORT = process.env.PORT || 3000;

mongoose.connect(process.env.MONGODB_URI)
    .then(() => {
        console.log('Connected to MongoDB successfully');

        app.listen(PORT, () => {
            console.log(`Server is running on http://localhost:${PORT}`);
        });
    })
    .catch(error => {
        console.error('Could not connect to MongoDB:', error.message);
        process.exit(1);
    });
