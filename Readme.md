# - tasck

    -- @-add - класс Error - для каждой утилиты что возвращает Error
        - createMashine
        - createActor
        - isValidSchema

# - @-[name]

    - @-add - нужно дополнить
    - @-fix - нужно поправить
    - @-check - нужно проверить

# - concept

    - Привязываться к типу продукта
    - Возможность подменять схемы
        - replaceSchema - принимает схему
            - валидировать схему при переключении
            - если не валидна транзакция замены не происходит и выкидывает ошибку - по ошибке не переключает (соответственно в кейсе где нужно поменять улицу на базу нужно дать беку понять что мы идем полице дальше)
        - replaceStateSchema - можно заменить схему перехода состояния
            - так же валидировать и если не прошла валидация не заменять
