
import React, { useMemo, useRef } from 'react';
import { Canvas, useFrame, useThree } from "@react-three/fiber";
import * as THREE from "three";
import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import { Button } from "./ui/button";
import { Badge } from "./ui/badge";

// Define Three.js elements as any to bypass TypeScript intrinsic element checks
const Mesh: any = 'mesh';
const PlaneGeometry: any = 'planeGeometry';
const ShaderMaterial: any = 'shaderMaterial';

gsap.registerPlugin(useGSAP);

interface ShaderPlaneProps {
	vertexShader: string;
	fragmentShader: string;
	uniforms: { [key: string]: { value: unknown } };
}

const ShaderPlane = ({
	vertexShader,
	fragmentShader,
	uniforms,
}: ShaderPlaneProps) => {
	const meshRef = useRef<THREE.Mesh>(null);
	const { size } = useThree();

	useFrame((state) => {
		if (meshRef.current) {
			const material = meshRef.current.material as THREE.ShaderMaterial;
			material.uniforms.u_time.value = state.clock.elapsedTime * 0.5;
			material.uniforms.u_resolution.value.set(size.width, size.height, 1.0);
		}
	});

	return (
		<Mesh ref={meshRef}>
			<PlaneGeometry args={[2, 2]} />
			<ShaderMaterial
				vertexShader={vertexShader}
				fragmentShader={fragmentShader}
				uniforms={uniforms}
				side={THREE.FrontSide}
				depthTest={false}
				depthWrite={false}
			/>
		</Mesh>
	);
};

const vertexShader = `
  varying vec2 vUv;
  void main() {
    vUv = uv;
    gl_Position = vec4(position, 1.0);
  }
`;

const fragmentShader = `
  precision highp float;

  varying vec2 vUv;
  uniform float u_time;
  uniform vec3 u_resolution;
  uniform sampler2D u_channel0;

  vec2 toPolar(vec2 p) {
      float r = length(p);
      float a = atan(p.y, p.x);
      return vec2(r, a);
  }

  vec2 fromPolar(vec2 polar) {
      return vec2(cos(polar.y), sin(polar.y)) * polar.x;
  }

  void mainImage(out vec4 fragColor, in vec2 fragCoord) {
      vec2 p = 6.0 * ((fragCoord.xy - 0.5 * u_resolution.xy) / u_resolution.y);

      vec2 polar = toPolar(p);
      float r = polar.x;
      float a = polar.y;

      vec2 i = p;
      float c = 0.0;
      float rot = r + u_time + p.x * 0.100;
      for (float n = 0.0; n < 4.0; n++) {
          float rr = r + 0.15 * sin(u_time*0.7 + float(n) + r*2.0);
          p *= mat2(
              cos(rot - sin(u_time / 10.0)), sin(rot),
              -sin(cos(rot) - u_time / 10.0), cos(rot)
          ) * -0.25;

          float t = r - u_time / (n + 30.0);
          i -= p + sin(t - i.y) + rr;

          c += 2.2 / length(vec2(
              (sin(i.x + t) / 0.15),
              (cos(i.y + t) / 0.15)
          ));
      }

      c /= 8.0;

      // CREASTILO COLORS: Cyan mixed with Blue/Purple
      vec3 baseColor = vec3(0.1, 0.6, 0.9);
      vec3 finalColor = baseColor * smoothstep(0.0, 1.0, c * 0.6);

      // Add a slight purple tint
      finalColor += vec3(0.3, 0.1, 0.5) * (c * 0.3);

      fragColor = vec4(finalColor, 1.0);
  }

  void main() {
      vec4 fragColor;
      vec2 fragCoord = vUv * u_resolution.xy;
      mainImage(fragColor, fragCoord);
      gl_FragColor = fragColor;
  }
`;

interface SyntheticHeroProps {
	title?: string;
	description?: string;
	badgeText?: string;
	badgeLabel?: string;
	ctaButtons?: Array<{ text: string; href?: string; primary?: boolean }>;
	microDetails?: Array<string>;
}

const SyntheticHero = ({
	title = "Convierte visitas en leads con una ruleta gamificada conectada a tu CRM.",
	description = "Registra, gira con probabilidades/stock, entrega cupón y dispara seguimientos. Abajo tienes la demo en vivo y un dashboard que se alimenta en tiempo real.",
	badgeText = "ONLINE • LEAD GEN",
	badgeLabel = "CRM INTEGRATION",
	ctaButtons = [
		{ text: "Probar Demo Interactiva", href: "#herramientas", primary: true },
		{ text: "Ver Dashboard", href: "#crm-demo" },
	],
	microDetails = [
		"Anti-fraude (Device ID)",
		"Probabilidades Ponderadas",
		"Control de Stock Real",
	],
}: SyntheticHeroProps) => {
	const sectionRef = useRef<HTMLElement | null>(null);
	const badgeWrapperRef = useRef<HTMLDivElement | null>(null);
	const headingRef = useRef<HTMLHeadingElement | null>(null);
	const paragraphRef = useRef<HTMLParagraphElement | null>(null);
	const ctaRef = useRef<HTMLDivElement | null>(null);
	const microRef = useRef<HTMLUListElement | null>(null);
	const shaderUniforms = useMemo(
		() => ({
			u_time: { value: 0 },
			u_resolution: { value: new THREE.Vector3(1, 1, 1) },
		}),
		[],
	);

	useGSAP(
		() => {
			if (badgeWrapperRef.current) {
				gsap.set(badgeWrapperRef.current, { autoAlpha: 0, y: -20 });
			}
            if (headingRef.current) {
                gsap.set(headingRef.current, { autoAlpha: 0, y: 30, scale: 0.95, filter: "blur(10px)" });
            }
			if (paragraphRef.current) {
				gsap.set(paragraphRef.current, { autoAlpha: 0, y: 20 });
			}
			if (ctaRef.current) {
				gsap.set(ctaRef.current, { autoAlpha: 0, y: 20 });
			}

			const microItems = microRef.current
				? Array.from(microRef.current.querySelectorAll("li"))
				: [];
			if (microItems.length > 0) {
				gsap.set(microItems, { autoAlpha: 0, y: 20 });
			}

			const tl = gsap.timeline({ defaults: { ease: "power3.out" } });

			if (badgeWrapperRef.current) {
				tl.to(
					badgeWrapperRef.current,
					{ autoAlpha: 1, y: 0, duration: 0.8 },
					0,
				);
			}

            if (headingRef.current) {
                tl.to(headingRef.current, {
                    autoAlpha: 1,
                    y: 0,
                    scale: 1,
                    filter: "blur(0px)",
                    duration: 1.2
                }, 0.2);
            }

			if (paragraphRef.current) {
				tl.to(
					paragraphRef.current,
					{ autoAlpha: 1, y: 0, duration: 0.8 },
					"-=0.8",
				);
			}

			if (ctaRef.current) {
				tl.to(
					ctaRef.current,
					{ autoAlpha: 1, y: 0, duration: 0.8 },
					"-=0.6",
				);
			}

			if (microItems.length > 0) {
				tl.to(
					microItems,
					{ autoAlpha: 1, y: 0, duration: 0.8, stagger: 0.1 },
					"-=0.6",
				);
			}
		},
		{ scope: sectionRef },
	);

    const handleDashboardAction = () => {
        const toolsSection = document.getElementById('herramientas');
        if (toolsSection) {
            toolsSection.scrollIntoView({ behavior: 'smooth' });
        }
        // Emit custom event to switch the tab to CRM
        window.dispatchEvent(new CustomEvent('change-tool-tab', { detail: 'crm' }));
    };

	return (
		<section
            id="home"
			ref={sectionRef}
			className="relative flex items-center justify-center min-h-screen overflow-hidden"
		>
			<div className="absolute inset-0 z-0">
				<Canvas>
					<ShaderPlane
						vertexShader={vertexShader}
						fragmentShader={fragmentShader}
						uniforms={shaderUniforms}
					/>
				</Canvas>
                <div className="absolute inset-0 bg-black/60 z-[1] backdrop-blur-[1px]"></div>
			</div>

			<div className="relative z-10 flex flex-col items-center text-center px-6 mt-16">
				<div ref={badgeWrapperRef}>
					<Badge className="mb-6 bg-cyan-900/30 hover:bg-cyan-900/50 text-cyan-300 backdrop-blur-md border border-cyan-500/30 uppercase tracking-wider font-medium flex items-center gap-2 px-4 py-1.5">
						<span className="text-[10px] font-light tracking-[0.18em] text-cyan-100/80">
							{badgeLabel}
						</span>
						<span className="h-1 w-1 rounded-full bg-cyan-400 animate-pulse" />
						<span className="text-xs font-light tracking-tight text-cyan-200">
							{badgeText}
						</span>
					</Badge>
				</div>

				<h1
					ref={headingRef}
					className="text-5xl md:text-7xl lg:text-8xl max-w-5xl font-display font-bold tracking-tight text-white mb-6 leading-tight"
				>
					{title}
				</h1>

				<p
					ref={paragraphRef}
					className="text-cyan-100/80 text-xl max-w-2xl mx-auto mb-10 font-light font-sans"
				>
					{description}
				</p>

				<div
					ref={ctaRef}
					className="flex flex-wrap items-center justify-center gap-4"
				>
					{ctaButtons.map((button, index) => {
						const isPrimary = button.primary ?? index === 0;
						const classes = isPrimary
							? "px-8 py-4 rounded-xl text-base font-bold backdrop-blur-lg bg-gradient-to-r from-cyan-500 to-purple-600 text-white hover:shadow-[0_0_30px_rgba(64,212,247,0.4)] transition-all cursor-pointer border-0"
							: "px-8 py-4 rounded-xl text-base font-bold border border-white/20 text-white hover:bg-white/10 backdrop-blur-lg transition-all cursor-pointer bg-transparent";

                        if (button.text === "Ver Dashboard") {
                            return (
                                <Button
                                    key={index}
                                    variant="outline"
                                    className={classes}
                                    onClick={handleDashboardAction}
                                >
                                    {button.text}
                                </Button>
                            );
                        }

						if (button.href) {
							return (
								<Button
									key={index}
									variant={isPrimary ? undefined : "outline"}
									className={classes}
									asChild
								>
									<a href={button.href}>{button.text}</a>
								</Button>
							);
						}

						return (
							<Button
								key={index}
								variant={isPrimary ? undefined : "outline"}
								className={classes}
							>
								{button.text}
							</Button>
						);
					})}
				</div>

				{microDetails.length > 0 && (
					<ul
						ref={microRef}
						className="mt-12 flex flex-wrap justify-center gap-8 text-sm font-mono tracking-tight text-cyan-200/70"
					>
						{microDetails.map((detail, index) => (
							<li key={index} className="flex items-center gap-2">
								<span className="h-1.5 w-1.5 rounded-full bg-cyan-400/60" />
								{detail}
							</li>
						))}
					</ul>
				)}
			</div>
		</section>
	);
};

export default SyntheticHero;
