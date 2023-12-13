import base64
import random
import pandas as pd


def encode(inputed: str):
    encoded_bytes = base64.b64encode(inputed.encode())
    return encoded_bytes.decode()


def decode(encoded):
    try:
        decoded_bytes = base64.b64decode(encoded.encode())
        return decoded_bytes.decode()
    except Exception as e:
        print("Ошибка декодирования:", e)
        return None


def random_seed() -> float:
    seed = random.random()
    return seed


async def data_frame(result: list) -> list[dict]:
    columns = ['task', 'task_type', 'date']
    df = pd.DataFrame(result, columns=columns)
    new_df = df.to_dict(orient="records")
    return new_df
