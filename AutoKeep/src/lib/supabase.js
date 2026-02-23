// 使用 Mock 数据绕过真实数据库验证，以便单纯进行 UI 界面开发
// 当用户配置好真实的 .env 数据库后，撤销这个 Mock 文件恢复原来的 createClient。

export const supabase = {
    auth: {
        async getSession() {
            return {
                data: {
                    session: {
                        user: { id: 'mock-user-123', email: 'test@ui-dev.local' },
                        access_token: 'mock-token'
                    }
                },
                error: null
            };
        },
        async getUser() {
            return {
                data: {
                    user: { id: 'mock-user-123', email: 'test@ui-dev.local' }
                },
                error: null
            };
        },
        onAuthStateChange(callback) {
            // 不自动触发状态改变，只返回 unsubscribe
            return {
                data: {
                    subscription: { unsubscribe: () => { } }
                }
            };
        },
        async signInWithPassword() {
            return { data: { user: { id: 'mock-user-123' }, session: {} }, error: null };
        },
        async signUp() {
            return { data: { user: { id: 'mock-user-123' }, session: {} }, error: null };
        },
        async signOut() {
            return { error: null };
        }
    },
    from: (table) => {
        // 模拟所有的增删改查
        return {
            select: () => {
                let p = Promise.resolve({ data: [], error: null });
                p.eq = () => p;
                p.order = () => p;
                p.single = () => p;
                return p;
            },
            insert: () => {
                let p = Promise.resolve({ data: [{}], error: null });
                p.select = () => p;
                return p;
            },
            update: () => {
                let p = Promise.resolve({ data: [{}], error: null });
                p.eq = () => p;
                p.select = () => p;
                return p;
            },
            delete: () => {
                let p = Promise.resolve({ error: null });
                p.eq = () => p;
                return p;
            }
        };
    }
};
