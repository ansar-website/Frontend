// get all lessons and quizes
const GetAllLessonsAndQs = (lessonsArr) => {
  const lessons = [];
  for (let index = 0; index < lessonsArr.length; index += 1) {
    lessons.push({ ...lessonsArr[index], type: 'lesson' });
    if (lessonsArr[index].quiz) {
      lessons.push({ ...lessonsArr[index].quiz, type: 'quiz' });
    }
  }
  return lessons;
};

export default GetAllLessonsAndQs;
