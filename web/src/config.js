// API Configuration - points to same backend as the iOS app
const APIConfig = {
    // Change this to your backend URL. Same as iOS APIConfig.swift
    baseURL: '/api',

    getURL(endpoint) {
        return `${this.baseURL}/${endpoint}`;
    }
};

export default APIConfig;
