
export default {
    publicDir: 'frontend',
    server: {
        host: true,
        proxy: {'/api': {target: {host: 'localhost', port: 5000}, ws: true}}
    },
}