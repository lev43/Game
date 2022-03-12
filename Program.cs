using System;
using System.Collections.Generic;
using System.Text;


using OpenTK;
using OpenTK.Graphics;
using OpenTK.Graphics.OpenGL;
using SFML;
using SFML.System;
using SFML.Graphics;
using SFML.Graphics.Glsl;
using SFML.Window;

public class Engine
{

    /// <summary>"Pixelate" fragment shader</summary>
    class RayMarchingShader : Drawable
    {
        public RayMarchingShader(uint width, uint height)
        {
            shader = new Shader("Shader.vert", null, "Shader.frag");
            shader.SetUniform("u_time", 0);
            shader.SetUniform("u_resolution", new Vec2(width, height));
            sprite = new Sprite(new Texture(width, height));
        }
        public void Resize(uint width, uint height)
        {
            shader.SetUniform("u_resolution", new Vec2(width, height));
            sprite.Scale = new Vector2f(width, height);
        }
        public void MouseMove(Vec2 mouse)
        {
            shader.SetUniform("u_mouse", mouse);
        }
        public void UpdateTime(float time) 
        {
            shader.SetUniform("u_time", time);
        }
        public void Draw(RenderTarget target, RenderStates states)
        {
            states = new RenderStates(states)
            {
                Shader = shader
            };
            target.Draw(sprite, states);
        }
        private Shader shader;
        private Sprite sprite;
    }
    public static void Main(string[] args)
    {
        var MainWindow = new RenderWindow(new VideoMode(800, 600), "The window", Styles.Close);
        MainWindow.SetVerticalSyncEnabled(true);

        MainWindow.Closed += (sender, e) => {
            MainWindow.Close();
        };

        RayMarchingShader shader = new RayMarchingShader(800, 600);

        MainWindow.Resized += (sender, e) => {
            shader.Resize(e.Width, e.Height);
        };
        MainWindow.MouseMoved += (sender, e) => {
            shader.MouseMove(new Vec2(e.X, e.Y));
        };

        Clock clock = new Clock();

        while(MainWindow.IsOpen)
        {
            MainWindow.DispatchEvents();
            MainWindow.Clear();
            try {
                shader = new RayMarchingShader(800, 600);
                shader.UpdateTime(clock.ElapsedTime.AsSeconds());
                MainWindow.Draw(shader);
                MainWindow.Display();
            } catch(SFML.LoadingFailedException err) {
                Console.Error.WriteLine(err);
            }
        }
    }
}