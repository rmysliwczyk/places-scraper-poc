pipeline {
    agent any

    stages {
        stage('Prepare Environment') {
            steps {
                script {
                    withCredentials([
                        string(credentialsId: 'GOOGLE_PLACES_API_KEY', variable: 'GOOGLE_PLACES_API_KEY'),
                        string(credentialsId: 'SCRAPER_BACKEND_URL', variable: 'SCRAPER_BACKEND_URL'),
                    ]) {
                        sh """
                        rm .env || true
                        rm scraper/.env || true
                        rm frontend/.env || true
                        echo "API_KEY=${GOOGLE_PLACES_API_KEY}" >> scraper/.env
                        echo "VITE_API_URL=${SCRAPER_BACKEND_URL}" >> frontend/.env
                        """
                    }
                }
            }
        }

        stage('Run Services') {
            steps {
                sh 'docker compose up --build --force-recreate -d'
            }
        }
    }
}
