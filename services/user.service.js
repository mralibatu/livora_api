const { where } = require("sequelize");
const db = require("../config/config");

const getAll = async () => {
    try {
        const users = await db.User.findAll();
        return users;
    } catch (error) {
        throw new Error('Error fetching users');
    }
};

const getUserById = async (id) => {
    try {
        const user = await db.User.findByPk(id);
        if (!user) {
            throw new Error(`User with ID ${id} not found`);
        }
        return user;
    } catch (error) {
        throw new Error(`Error fetching user with ID ${id}: ${error.message}`);
    }
};

const getUserExamStats = async (userId) => {
    try {
        // Kullanıcının tamamladığı tüm sınavlar
        const userExams = await db.UserExam.findAll({
            where: { user_id: userId },
            include: [
                {
                    model: db.Exam,
                    as: 'userexamxexam', // Assuming there's a relation to Exam model
                    attributes: ['exam_name'],
                },
            ],
        });

        if (userExams.length === 0) {
            return { message: "User has not participated in any exams." };
        }

        // Kullanıcının sınav verileri ile istatistikleri hazırlama
        const examStats = userExams.map(exam => {
            return {
                examId: exam.exam_id,
                exam_name: exam.userexamxexam.exam_name,
                isCompleted: exam.is_completed,
                point: exam.point,
                isSuccessful: exam.point >= 75, // Örneğin, başarılı kullanıcılar 60 ve üzeri puan alır
            };
        });

        // Kullanıcının tamamladığı sınav sayısı
        const completedExams = userExams.filter(exam => exam.is_completed).length;

        // Kullanıcının başarılı olduğu sınav sayısı
        const successfulExams = userExams.filter(exam => exam.is_completed && exam.point >= 60).length;

        // Kullanıcının sınav ortalama puanı
        const averageScore = userExams.reduce((sum, exam) => sum + (exam.point || 0), 0) / completedExams;

        return {
            userId,
            totalExams: userExams.length,
            completedExams,
            successfulExams,
            averageScore: isNaN(averageScore) ? 0 : averageScore.toFixed(2), // Ortalaması iki basamağa yuvarlanır
            examStats,
        };
    } catch (error) {
        console.error("Error fetching user exam stats:", error);
        throw new Error("Error fetching user exam stats");
    }
};

const getUserExamStatsByExam = async (userId, examId) => {
    try {
        // Kullanıcının belirli bir sınavdaki verilerini al
        const userExam = await db.UserExam.findOne({
            where: {
                user_id: userId,
                exam_id: examId,
            },
            include: [
                {
                    model: db.Exam,
                    as: 'userexamxexam', // Assuming there's a relation to Exam model
                    attributes: ['exam_name'],
                },
            ],
        });

        if (!userExam) {
            return { message: "No data found for this user and exam combination." };
        }

        // Kullanıcının sınav bilgileri
        const examStats = {
            examId: userExam.exam_id,
            exam_name: userExam.userexamxexam.exam_name,
            isCompleted: userExam.is_completed,
            point: userExam.point,
            isSuccessful: userExam.point >= 75, // Örneğin, başarılı kullanıcılar 60 ve üzeri puan alır
        };

        return examStats;
    } catch (error) {
        console.error("Error fetching user exam stats by exam:", error);
        throw new Error("Error fetching user exam stats by exam");
    }
};

const updateUserExam = async (userId, examId, updates) => {
    try {
        // Find the UserExam record for the specific user and exam
        const userExam = await db.UserExam.findOne({
            where: { user_id: userId, exam_id: examId }
        });

        if (!userExam) {
            throw new Error('UserExam record not found');
        }

        // Update the UserExam record with new data
        await userExam.update(updates);

        return {
            success: true,
            message: 'UserExam record updated successfully',
            data: userExam,
        };
    } catch (error) {
        console.error('Error updating UserExam:', error);
        throw new Error('Error updating UserExam');
    }
};


const getUserWordInfo = async (userId, wordId) => {
    try {
        const userWordInfo = await db.UserWord.findOne({
            where: {
                user_id: userId,
                word_id: wordId
            },
            attributes: ['id', 'word_id' ,'is_learned', 'is_favorite'], // Select specific columns from UserWord
        });

        if (!userWordInfo) {
            throw new Error('UserWord not found');
        }

        return userWordInfo;
    } catch (error) {
        throw new Error(`Error fetching user word info: ${error.message}`);
    }
};

const updateUserWordInfo = async (userId, wordId, updates) => {
    try {
        // Ensure updates only contain valid fields
        const validUpdates = {};
        if (updates.is_learned !== undefined) validUpdates.is_learned = updates.is_learned;
        if (updates.is_favorite !== undefined) validUpdates.is_favorite = updates.is_favorite;

        if (Object.keys(validUpdates).length === 0) {
            throw new Error('No valid fields to update');
        }

        const [updatedRowsCount] = await db.UserWord.update(validUpdates, {
            where: {
                user_id: userId,
                word_id: wordId,
            },
        });

        if (updatedRowsCount === 0) {
            throw new Error(`No UserWord record found for user_id: ${userId}, word_id: ${wordId}`);
        }

        return `UserWord record updated successfully for user_id: ${userId}, word_id: ${wordId}`;
    } catch (error) {
        throw new Error(`Error updating UserWord info: ${error.message}`);
    }
};



const getAllWordsForUser = async (userId) => {
    try {
        const userWords = await db.UserWord.findAll({
            where: { user_id: userId },
            include: [
                {
                    model: db.Word,  // Word modeliyle ilişkiyi ekle
                    as: 'userwordxword', // İlişki adı
                    attributes: ['foreign_word', 'main_lang_word'], // Kelimenin kendisi
                },
            ],
        });

        if (userWords.length === 0) {
            return { message: "User has no words." };
        }

        const allWords = userWords.map(userWord => {
            return {
                word: userWord.userwordxword.foreign_word,  // Kelimenin adı
                isLearned: userWord.is_learned,    // Öğrenildi durumu
                reviewCount: userWord.review_count, // Gözden geçirme sayısı
                lastReviewed: userWord.last_reviewed, // Son gözden geçirme tarihi
                isFavorite: userWord.is_favorite,   // Favori durumu
            };
        });

        return allWords;
    } catch (error) {
        console.error("Error fetching user's words:", error);
        throw new Error("Error fetching user's words");
    }
};

const getLearnedWordsForUser = async (userId) => {
    try {
        const learnedWords = await db.UserWord.findAll({
            where: { user_id: userId, is_learned: true }, // sadece öğrenilen kelimeler
            include: [
                {
                    model: db.Word,
                    as: 'userwordxword',
                    attributes: ['foreign_word', 'main_lang_word'],
                },
            ],
        });

        if (learnedWords.length === 0) {
            return { message: "User has no learned words." };
        }

        const learnedWordsList = learnedWords.map(userWord => {
            return {
                word: userWord.userwordxword.foreign_word, 
                reviewCount: userWord.review_count,
                lastReviewed: userWord.last_reviewed,
                isFavorite: userWord.is_favorite,
            };
        });

        return learnedWordsList;
    } catch (error) {
        console.error("Error fetching learned words:", error);
        throw new Error("Error fetching learned words");
    }
};

const getUserWordStats = async (userId) => {
    try {
        // Kullanıcının kelimelerini ve kullanıcı bilgilerini al
        const userWords = await db.UserWord.findAll({
            where: { user_id: userId },
            include: [
                {
                    model: db.User, // Kullanıcıyı dahil et
                    as: 'userwordxuser', // User tablosuyla ilişki
                    attributes: ['streak_count'], // Streak count'u al
                },
            ],
        });

        if (userWords.length === 0) {
            return { message: "User has no words." };
        }

        // Öğrenilen kelimeler
        const learnedWords = userWords.filter(userWord => userWord.is_learned);
        const totalLearnedWords = learnedWords.length;

        // Favori kelimeler
        const favoriteWords = userWords.filter(userWord => userWord.is_favorite);
        const totalFavoriteWords = favoriteWords.length;

        // Toplam gözden geçirme sayısı
        const totalReviewCount = userWords.reduce((sum, userWord) => sum + userWord.review_count, 0);

        // Son gözden geçirme tarihi
        const lastReviewed = userWords.reduce((latest, userWord) => {
            const reviewDate = new Date(userWord.last_reviewed);
            return reviewDate > latest ? reviewDate : latest;
        }, new Date(0)); // 1970-01-01 başlangıç tarihi

        // Kullanıcının streak_count bilgisini al
        const streakCount = userWords[0].userwordxuser.streak_count;

        return {
            totalWords: userWords.length,
            totalLearnedWords,
            totalFavoriteWords,
            totalReviewCount,
            lastReviewed: lastReviewed.toISOString(),
            streakCount,  // Kullanıcının streak_count bilgisini ekle
        };
    } catch (error) {
        console.error("Error fetching user word stats:", error);
        throw new Error("Error fetching user word stats");
    }
};

const getUserLists = async (userId) => {
    try {
        const userLists = await db.UserList.findAll({
            where: { user_id: userId },
            include: [
                {
                    model: db.List, // List modelini dahil et
                    as: 'userlistxlist', // List tablosuyla ilişki
                    attributes: ['list_name'], // Liste adı gibi özellikleri al
                },
            ],
        });

        if (userLists.length === 0) {
            return { message: "User has not been added to any lists." };
        }

        const userListsData = userLists.map(userList => ({
            listId: userList.list_id,
            listName: userList.userlistxlist.name,
            isCompleted: userList.is_completed
        }));

        return userListsData;
    } catch (error) {
        console.error("Error fetching user lists:", error);
        throw new Error("Error fetching user lists");
    }
};

// Kullanıcının tamamladığı listeleri al
const getUserCompletedLists = async (userId) => {
    try {
        const completedLists = await db.UserList.findAll({
            where: { 
                user_id: userId,
                is_completed: true
            },
            include: [
                {
                    model: db.List, // List modelini dahil et
                    as: 'userlistxlist', // List tablosuyla ilişki
                    attributes: ['list_name'],
                },
            ],
        });

        if (completedLists.length === 0) {
            return { message: "User has not completed any lists." };
        }

        const completedListsData = completedLists.map(completedList => ({
            listId: completedList.list_id,
            listName: completedList.userlistxlist.name,
            isCompleted: completedList.is_completed
        }));

        return completedListsData;
    } catch (error) {
        console.error("Error fetching completed user lists:", error);
        throw new Error("Error fetching completed user lists");
    }
};

// Kullanıcının listeleriyle ilgili istatistikleri al
const getUserListStats = async (userId) => {
    try {
        const userLists = await db.UserList.findAll({
            where: { user_id: userId },
            include: [
                {
                    model: db.List, // List modelini dahil et
                    as: 'userlistxlist',
                    attributes: ['list_name'],
                },
            ],
        });

        if (userLists.length === 0) {
            return { message: "User has not been added to any lists." };
        }

        // Tamamlanan listeler
        const completedLists = userLists.filter(userList => userList.is_completed);
        const totalCompletedLists = completedLists.length;

        // Toplam listeler
        const totalLists = userLists.length;

        return {
            totalLists,
            totalCompletedLists,
            completionRate: totalLists === 0 ? 0 : ((totalCompletedLists / totalLists) * 100).toFixed(2), // Tamamlanan liste oranı
        };
    } catch (error) {
        console.error("Error fetching user list stats:", error);
        throw new Error("Error fetching user list stats");
    }
};

const getSpecificListStats = async (listId) => {
    try {
        const listUsers = await db.UserList.findAll({
            where: { list_id: listId },
            include: [
                {
                    model: db.User,
                    as: 'userlistxuser',
                    attributes: ['username'], // Include user information if needed
                },
            ],
        });

        if (listUsers.length === 0) {
            return { message: "No users have been added to this list." };
        }

        // Calculate stats
        const totalUsers = listUsers.length;
        const completedUsers = listUsers.filter(userList => userList.is_completed);
        const totalCompletedUsers = completedUsers.length;

        // Get list details
        const listDetails = await db.List.findByPk(listId);
        
        return {
            listName: listDetails?.list_name || 'Unknown List',
            totalUsers,
            totalCompletedUsers,
            completionRate: ((totalCompletedUsers / totalUsers) * 100).toFixed(2),
            averageProgress: (listUsers.reduce((sum, user) => sum + (user.progress || 0), 0) / totalUsers).toFixed(2),
            completedUsers: completedUsers.map(user => ({
                username: user.userlistxuser.username,
                completedAt: user.completed_at
            }))
        };
    } catch (error) {
        console.error("Error fetching list stats:", error);
        throw new Error("Error fetching list stats");
    }
};


const createUser = async (userData) => {
    try {
        const newUser = await db.User.create(userData);
        return newUser;
    } catch (error) {
        throw new Error('Error creating user');
    }
};

const updateUser = async (id, userData) => {
    try {
        const user = await db.User.findByPk(id);
        if (!user) {
            throw new Error('User not found');
        }
        await user.update(userData);
        return user;
    } catch (error) {
        throw new Error('Error updating user');
    }
};


const deleteUser = async (id) => {
    try {
        const user = await db.User.findByPk(id);
        if (!user) {
            throw new Error('User not found');
        }
        await user.destroy();
        return { message: 'User deleted successfully' };
    } catch (error) {
        throw new Error('Error deleting user');
    }
};

module.exports = {
    getAll,
    getUserById,
    getUserExamStats,
    getUserExamStatsByExam,
    getAllWordsForUser,
    getLearnedWordsForUser,
    getUserWordStats,
    getUserWordInfo,
    getUserLists,
    getUserCompletedLists,
    getUserListStats,
    getSpecificListStats,
    createUser,
    updateUser,
    updateUserExam,
    updateUserWordInfo,
    deleteUser
};