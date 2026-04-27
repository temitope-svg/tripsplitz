import { API_CONFIG } from "./api.util";



export const getUserProfileImageUrl = (image_path: string | null) => {
    if (!image_path) return 'https://api.dicebear.com/9.x/initials/svg?seed=Toyyib';
    return `${API_CONFIG.STORAGE_BASE_URL}/${image_path}`;
}

export const getTripImageUrl = (image_path: string | null) => {
    if (!image_path) return 'https://picsum.photos/1100/700';
    return `${API_CONFIG.STORAGE_BASE_URL}/${image_path}`;
}

export const getActivityReceiptUrl = (image_path: string | null) => {
    if (!image_path) return 'https://picsum.photos/1100/700';
    return `${API_CONFIG.STORAGE_BASE_URL}/${image_path}`;
}