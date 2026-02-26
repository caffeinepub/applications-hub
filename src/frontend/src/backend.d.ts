import type { Principal } from "@icp-sdk/core/principal";
export interface Some<T> {
    __kind__: "Some";
    value: T;
}
export interface None {
    __kind__: "None";
}
export type Option<T> = Some<T> | None;
export interface ParentalControls {
    contentFilterEnabled: boolean;
    maxAgeRating: bigint;
}
export interface UserProfile {
    dob: bigint;
    cameraVerification: boolean;
    username: string;
    displayName: string;
    ageVerified: boolean;
    parentalControls: ParentalControls;
    verifiedAge?: bigint;
    passwordHash: string;
}
export enum UpdateUserProfileResponse {
    wrongPassword = "wrongPassword",
    usernameAlreadyExists = "usernameAlreadyExists",
    registerNotFound = "registerNotFound",
    success = "success"
}
export interface backendInterface {
    addAdmin(username: string): Promise<boolean>;
    countUsers(): Promise<bigint>;
    getAllUsers(): Promise<Array<UserProfile>>;
    getUserProfile(username: string): Promise<UserProfile | null>;
    isUsernameTaken(username: string): Promise<boolean>;
    login(username: string, passwordHash: string): Promise<UserProfile | null>;
    register(username: string, passwordHash: string, dob: bigint): Promise<UpdateUserProfileResponse>;
    removeUser(username: string): Promise<boolean>;
    updateCameraVerification(username: string, cameraEnabled: boolean): Promise<boolean>;
    updateDisplayName(username: string, newDisplayName: string): Promise<boolean>;
    updateParentalControls(username: string, contentFilterEnabled: boolean, maxAgeRating: bigint): Promise<boolean>;
    updatePassword(username: string, oldPasswordHash: string, newPasswordHash: string): Promise<boolean>;
    verifyAge(username: string, verifiedAge: bigint): Promise<boolean>;
}
