import fetch from "node-fetch";

export const makeRequest = async (path: string, query?: any) => {
    const url = new URL("https://api.stackexchange.com");

    url.pathname = path;

    if (typeof query !== 'undefined') {
        for (const key in query) {
            url.searchParams.set(key, query[key]);
        }
    }

    return (await (await fetch(url.href)).json()) as any;
};

export interface BadgeCount {
    bronze: number;
    gold: number;
    silver: number;
}

export interface ShallowUser {
    accept_rate?: number;
    account_id: number;
    badge_counts?: BadgeCount;
    display_name?: string;
    link?: string;
    profile_image?: string;
    reputation?: number;
    user_id?: number;
    user_type: "unregistered" | "registered" | "moderator" | "team_admin" | "does_not_exist";
}

export interface CollectiveExternalLink {
    link: string;
    type: "website" | "twitter" | "github" | "facebook" | "instagram" | "support" | "linkedin";
}

export interface Collective {
    description: string;
    external_links: CollectiveExternalLink[];
    link: string;
    name: string;
    slug: string;
    tags: string[];
}

export interface Comment {
    body?: string;
    body_markdown?: string;
    can_flag?: boolean;
    comment_id: number;
    content_license: string;
    creation_date: string;
    edited: boolean;
    link?: string;
    owner?: ShallowUser;
    post_id: number;
    post_type?: "question" | "answer" | "article";
    reply_to_user?: ShallowUser;
    score: number;
    upvoted?: boolean;
}

export interface CollectiveRecommendation {
    collective: Collective;
    creation_date: string;
}

export interface Answer {
    accepted?: boolean;
    answer_id: number;
    awarded_bounty_amount?: number;
    awarded_bounty_users?: ShallowUser[];
    body?: string;
    body_markdown?: string;
    can_comment?: boolean;
    can_edit?: boolean;
    can_flag?: boolean;
    can_suggest_edit?: boolean;
    collectives: Collective[];
    comment_count?: number;
    comments?: Comment[];
    community_owned_date?: string;
    content_license: string;
    creation_date: string;
    down_vote_count?: number;
    downvoted?: boolean;
    is_accepted: boolean;
    last_activity_date: string;
    last_edit_date?: string;
    last_editor?: ShallowUser;
    link?: string;
    locked_date?: string;
    owner?: ShallowUser;
    posted_by_collectives: Collective[];
    question_id: number;
    recommendations: CollectiveRecommendation[];
    score: number;
    share_link?: string;
    tags?: string[];
    title?: string;
    up_vote_count?: number;
    upvoted?: boolean;
}

export interface OriginalQuestion {
    accepted_answer_id?: number;
    answer_count: number;
    question_id: number;
    title: string;
}

export interface ClosedDetails {
    by_users: ShallowUser[];
    description: string;
    on_hold: boolean;
    original_questions?: OriginalQuestion[];
    reason: string;
}

export interface MigrationInfo {
    on_date: string;
    other_site: string;
    question_id: number;
}

export interface Notice {
    body: string;
    creation_date: string;
    owner_user_id: number;
}

export interface Question {
    accepted_answer_id: number;
    answer_count: number;
    answers?: Answer[];
    body?: string;
    body_markdown?: string;
    bounty_amount?: number;
    bounty_closes_date?: string;
    bounty_user?: ShallowUser;
    can_answer?: boolean;
    can_close?: boolean;
    can_comment?: boolean;
    can_edit?: boolean;
    can_flag?: boolean;
    can_suggest_edit?: boolean;
    close_vote_count?: number;
    closed_date?: string;
    closed_details?: ClosedDetails;
    closed_reason?: string;
    collectives: Collective[];
    comment_count?: number;
    comments?: Comment[];
    community_owned_date?: string;
    content_license: string;
    creation_date: string;
    delete_vote_count?: number;
    down_vote_count?: number;
    downvoted?: boolean;
    favorite_count?: number;
    favorited?: boolean;
    is_answered: boolean;
    last_activity_date: string;
    last_edit_date?: string;
    last_editor?: ShallowUser;
    link: string;
    locked_date?: string;
    migrated_from?: MigrationInfo;
    migrated_to?: MigrationInfo;
    notice?: Notice;
    owner?: ShallowUser;
    posted_by_collectives: Collective[];
    protected_date?: string;
    question_id: number;
    reopen_vote_count?: number;
    score: number;
    share_link?: string;
    tags: string[];
    title: string;
    up_vote_count?: number;
    upvoted?: boolean;
    view_count: number;
}