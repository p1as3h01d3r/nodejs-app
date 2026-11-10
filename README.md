# Hello World на Node.js

HTTP-сервис без внешних зависимостей. Слушает `0.0.0.0:8080` и возвращает
статус `200`, `Content-Type: application/json; charset=utf-8` и только JSON-строку:

```json
"helloworld"
```

## Локальный запуск

Нужен Node.js 22 или новее. Установка зависимостей не требуется.

```sh
npm start
```

Проверка из другого терминала:

```sh
curl http://localhost:8080/
```

Тест:

```sh
npm test
```

## Docker

```sh
docker build -t helloworld:0.1.0 .
docker run --rm --name helloworld -p 8080:8080 helloworld:0.1.0
```

Контейнер работает от непривилегированного пользователя. При `SIGTERM`
приложение прекращает принимать соединения и завершает текущие запросы.

## Kubernetes

Манифесты в `k8s/` создают Deployment и Service типа ClusterIP на порту `8080`.
Настроены readiness/liveness-пробы, ограничения ресурсов и read-only файловая система.

### Образ для кластера

Для удалённого кластера опубликуйте образ в доступном ему registry
(замените пример адреса своим):

```sh
docker tag helloworld:0.1.0 registry.example.com/your-project/helloworld:0.1.0
docker push registry.example.com/your-project/helloworld:0.1.0
```

Затем замените `image: helloworld:0.1.0` в `k8s/deployment.yaml` полным адресом
опубликованного образа. Для приватного registry также настройте `imagePullSecrets`.

Для локального кластера можно оставить исходное имя образа и загрузить его
одной из команд, в зависимости от используемого кластера:

```sh
# kind
kind load docker-image helloworld:0.1.0

# minikube
minikube image load helloworld:0.1.0
```

### Деплой и проверка

Убедитесь, что `kubectl` использует нужные context и namespace:

```sh
kubectl config current-context
kubectl apply -f k8s/
kubectl rollout status deployment/helloworld
kubectl port-forward service/helloworld 8080:8080
```

Из другого терминала выполните `curl http://localhost:8080/`.
Порт `8080` на вашей машине должен быть свободен: остановите локальный сервер
или Docker-контейнер, если они ещё запущены. Service не публикует приложение
в интернете; для внешнего доступа отдельно настройте Ingress или LoadBalancer.
