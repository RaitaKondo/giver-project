# ---- build stage ----
FROM eclipse-temurin:21-jdk AS build
WORKDIR /workspace

# 依存解決をキャッシュしやすい順でコピー
COPY gradlew settings.gradle build.gradle ./
COPY gradle ./gradle
RUN chmod +x gradlew
RUN ./gradlew --no-daemon dependencies >/dev/null 2>&1 || true

# ソースをコピーしてjar作成
COPY src ./src
RUN ./gradlew --no-daemon clean bootJar

# ---- runtime stage ----
FROM eclipse-temurin:21-jre
WORKDIR /app

# 非root実行（権限を落とす）
RUN useradd -m appuser
USER appuser

# ビルド成果物をコピー
COPY --from=build /workspace/build/libs/*.jar app.jar

# Cloud Runは8080を期待することが多い（PORTで上書きも可能）
EXPOSE 8080

# JVMオプションを外から注入できるようにしておく
ENV JAVA_OPTS=""
ENTRYPOINT ["sh", "-c", "java $JAVA_OPTS -jar /app/app.jar"]