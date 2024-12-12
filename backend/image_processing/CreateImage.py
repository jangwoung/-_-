from diffusers import StableDiffusionImg2ImgPipeline
import torch
from PIL import Image

def Create_Image(input_image, prompt):
    model_id = "stabilityai/stable-diffusion-2"
    pipe = StableDiffusionImg2ImgPipeline.from_pretrained(model_id, torch_dtype=torch.float16)
    pipe = pipe.to("cuda")  # GPUを使用

    # 入力画像を準備
    init_image = input_image.convert("RGB")
    init_image = init_image.resize((512, 512))

    # 画像生成
    generated_image = pipe(prompt=prompt, image=init_image, strength=0.75, guidance_scale=7.5).images[0]
    return generated_image
