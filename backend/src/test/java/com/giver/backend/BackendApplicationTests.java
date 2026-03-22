package com.giver.backend;

import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.Disabled;
import org.springframework.boot.test.context.SpringBootTest;

@Disabled("MVP段階ではDB依存の統合起動テストを実行対象外にする")
@SpringBootTest(properties = {
    // CI/ローカルの単体テストでは実DB接続を前提にしないため、DB/Flyway/JPA自動構成を除外する。
    "spring.autoconfigure.exclude="
        + "org.springframework.boot.jdbc.autoconfigure.DataSourceAutoConfiguration,"
        + "org.springframework.boot.flyway.autoconfigure.FlywayAutoConfiguration,"
        + "org.springframework.boot.data.jpa.autoconfigure.JpaRepositoriesAutoConfiguration,"
        + "org.springframework.boot.data.jpa.autoconfigure.HibernateJpaAutoConfiguration"
})
class BackendApplicationTests {

    @Test
    void contextLoads() {
    }

}
