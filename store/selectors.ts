import { selector } from "recoil";

import {
  diaryListState,
  filter,
  goalListState,
  meState,
  postListState,
  todoListState,
} from "./atoms";

export const todoListSelector = selector({
  key: "todoListSelector",
  get: ({ get }) => get(todoListState),
  set: ({ set }, newValue) => set(todoListState, newValue),
});

export const filteredTodoListSelector = selector({
  key: "FilteredTodoListSelector",
  get: ({ get }) => {
    const done = get(filter);
    const list = get(todoListState);

    switch (done) {
      case "done":
        return list.filter((todo) => todo.done === true);
      default:
        return list;
    }
  },
});

export const goalListSelector = selector({
  key: "goalListSelector",
  get: ({ get }) => get(goalListState),
  set: ({ set }, newValue) => set(goalListState, newValue),
});

export const meSelector = selector({
  key: "meSelector",
  get: ({ get }) => get(meState),
});

export const postListSelector = selector({
  key: "postListSelector",
  get: ({ get }) => get(postListState),
  set: ({ set }, newValue) => set(postListState, newValue),
});

// export const settingSelector = selector({
//   key: "settingSelector",
//   get: ({ get }) => get(settingState),
// });

export const diaryListSelector = selector({
  key: "diaryListSelector",
  get: ({ get }) => get(diaryListState),
  set: ({ set }, newValue) => set(diaryListState, newValue),
});
