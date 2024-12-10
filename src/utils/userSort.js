/* eslint-disable no-unused-vars */

const immutableSort = (array, compareFunc) => {
  const arrayCopy = array.slice();
  arrayCopy.sort(compareFunc);
  return arrayCopy;
}

export const sortUsersBySecondName = (unsortedUsers) => {
  return immutableSort(unsortedUsers, (a, b) => a.last_name.localeCompare(b.last_name));
}

export const sortUserByRating = (unsortedUsers) => {
  return immutableSort( unsortedUsers, (a, b) => b.rating - a.rating)
  .map((user) => { 
    const {rating, comment, ...filtered} = user;
    return filtered; 
  });
}