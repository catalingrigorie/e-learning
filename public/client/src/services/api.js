import axios from "axios";

let token = localStorage.getItem("token");

const Api = axios.create({
  baseURL: "http://localhost:5000/api/v1",
  headers: {
    Authorization: `Bearer ${token}`,
  },
});

export class AuthenticationService {
  static login(credentials) {
    return Api.post("/auth/login", credentials);
  }

  static logout() {
    return Api.get("/auth/logout");
  }

  static register(data) {
    return Api.post("/auth/register", data);
  }

  static getUser() {
    if (!token) return;
    return Api.get("/auth/currentuser");
  }

  static changePassword(data) {
    return Api.put("/auth/changePassword", data);
  }
}

export class ReviewsService {
  static getReview(id) {
    return Api.get(`/camps/${id}/reviews`);
  }

  static getReviews() {
    return Api.get("/reviews");
  }

  static postReview(id, data) {
    return Api.post(`/camps/${id}/reviews`, data);
  }

  static deleteReview(id) {
    return Api.delete(`/reviews/${id}`);
  }
}

export class CampsService {
  static getFilteredCamps(query) {
    return Api.get(`/camps?careers=${query}`);
  }

  static getTrendingCamps(query, careerType) {
    return Api.get(`/camps?${query}&careers=${careerType}`);
  }

  static getCamp(id) {
    return Api.get(`/camps/${id}`);
  }

  static createCamp(data) {
    return Api.post("/camps", data);
  }

  static editCamp(id, data) {
    return Api.put(`/camps/${id}`, data);
  }

  static deleteCamp(id) {
    return Api.delete(`/camps/${id}`);
  }

  static uploadPhoto(id, file) {
    return Api.put(`/camps/${id}/image`, file);
  }

  static sendMail(id, user) {
    return Api.post(`/camps/${id}/signup`, user);
  }

  static getCamps() {
    return Api.get("/camps");
  }
}

export class CoursesService {
  static createCourse(id, data) {
    return Api.post(`/camps/${id}/courses`, data);
  }

  static getCourses() {
    return Api.get("/courses");
  }

  static deleteCourse(id) {
    return Api.delete(`/courses/${id}`);
  }
}
