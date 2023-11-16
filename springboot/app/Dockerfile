FROM maven:3.9-amazoncorretto-17 AS buildstage

COPY . /home/app/backend

WORKDIR /home/app/backend

RUN mvn clean package -DskipTests

FROM maven:3.9-amazoncorretto-17 as runstage

WORKDIR /home/app/backend

COPY --from=buildstage /home/app/backend/target/chunk-upload-manager.jar /home/app/backend/

EXPOSE 8080

ENTRYPOINT ["java", "-jar", "chunk-upload-manager.jar"]